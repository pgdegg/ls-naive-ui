/* eslint-disable ts/no-namespace */
/*
 * QR Code generator library (TypeScript)
 *
 * Copyright (c) Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/qr-code-generator-library
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 */

'use strict'

namespace qrcodegen {
  type bit = number
  type byte = number
  type int = number

  /* ---- QR Code 符号类 ---- */

  /*
   * QR Code 符号是一种二维条形码。
   * 由 Denso Wave 发明，并在 ISO/IEC 18004 标准中定义。
   * 该类的实例表示一个由深色与浅色单元组成的不可变方形网格。
   * 该类提供静态工厂函数，用于从文本或二进制数据创建 QR Code。
   * 该类覆盖 QR Code Model 2 规范，支持所有版本（尺寸）
   * 从 1 到 40、全部 4 种纠错等级以及 4 种字符编码模式。
   *
   * 创建 QR Code 对象的方式：
   * - 高层：取负载数据并调用 QrCode.encodeText() 或 QrCode.encodeBinary()。
   * - 中层：自行构造段列表并调用 QrCode.encodeSegments()。
   * - 低层：自行构造数据码字字节数组（包含
   *   段头与最终填充，不含纠错码字），
   *   提供合适的版本号，然后调用 QrCode() 构造函数。
   * （注意：所有方式都需要提供期望的纠错等级。）
   */
  export class QrCode {
    /* -- 静态工厂函数（高层） -- */

    // 返回以给定纠错等级表示给定 Unicode 文本字符串的 QR Code。
    // 作为保守上限，当字符串包含 738 个或更少
    // Unicode 码点（而非 UTF-16 码元）且使用低纠错等级时，本函数保证成功。输出会自动选择最小可用
    // QR Code 版本。若无需提高版本号，结果的 ECC 等级可能高于
    // ecl 参数。
    public static encodeText(text: string, ecl: QrCode.Ecc): QrCode {
      const segs: QrSegment[] = qrcodegen.QrSegment.makeSegments(text)
      return QrCode.encodeSegments(segs, ecl)
    }

    // 返回以给定纠错等级表示给定二进制数据的 QR Code。
    // 本函数始终使用二进制段模式编码，不使用任何文本模式。允许的最大
    // 字节数为 2953。输出会自动选择最小可用的 QR Code 版本。
    // 结果的 ECC 等级可能高于 ecl 参数。
    public static encodeBinary(
      data: Readonly<byte[]>,
      ecl: QrCode.Ecc
    ): QrCode {
      const seg: QrSegment = qrcodegen.QrSegment.makeBytes(data)
      return QrCode.encodeSegments([seg], ecl)
    }

    /* -- 静态工厂函数（中层） -- */

    // 返回以给定编码参数表示给定各段的 QR Code。
    // 会自动在给定范围内选择最小可用的 QR Code 版本。
    // 若 boostEcl 为 true，结果的 ECC 等级
    // 可能高于 ecl 参数，前提是无需提高版本号。
    // 掩模号可取 0 到 7（含）以强制使用该
    // 掩模，或取 -1 由系统自动选择合适掩模（可能较慢）。
    // 本函数允许用户创建自定义段序列，在各模式之间切换
    // （例如字母数字模式与字节模式），从而用更少空间编码文本。
    // 这是中层 API；高层 API 为 encodeText() 与 encodeBinary()。
    public static encodeSegments(
      segs: Readonly<QrSegment[]>,
      ecl: QrCode.Ecc,
      minVersion: int = 1,
      maxVersion: int = 40,
      mask: int = -1,
      boostEcl: boolean = true
    ): QrCode {
      if (
        !(
          QrCode.MIN_VERSION <= minVersion
          && minVersion <= maxVersion
          && maxVersion <= QrCode.MAX_VERSION
        )
        || mask < -1
        || mask > 7
      ) {
        throw new RangeError('Invalid value')
      }

      // 查找可使用的最小版本号
      let version: int
      let dataUsedBits: int
      for (version = minVersion; ; version++) {
        const dataCapacityBits: int
          = QrCode.getNumDataCodewords(version, ecl) * 8 // 可用数据位数
        const usedBits: number = QrSegment.getTotalBits(segs, version)
        if (usedBits <= dataCapacityBits) {
          dataUsedBits = usedBits
          break // 该版本号被判定为合适
        }
        if (version >= maxVersion) {
          // 范围内所有版本都无法容纳给定数据
          throw new RangeError('Data too long')
        }
      }

      // 在数据仍能放入当前版本号的前提下提高纠错等级
      for (const newEcl of [
        QrCode.Ecc.MEDIUM,
        QrCode.Ecc.QUARTILE,
        QrCode.Ecc.HIGH
      ]) {
        // 从低到高
        if (
          boostEcl
          && dataUsedBits <= QrCode.getNumDataCodewords(version, newEcl) * 8
        ) {
          ecl = newEcl
        }
      }

      // 拼接所有段以生成数据位串
      const bb: bit[] = []
      for (const seg of segs) {
        appendBits(seg.mode.modeBits, 4, bb)
        appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb)
        for (const b of seg.getData()) {
          bb.push(b)
        }
      }

      // 添加终止符，并按需填充至字节边界
      const dataCapacityBits: int = QrCode.getNumDataCodewords(version, ecl) * 8
      appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb)
      appendBits(0, (8 - (bb.length % 8)) % 8, bb)

      // 用交替字节填充，直至达到数据容量
      for (
        let padByte = 0xEC;
        bb.length < dataCapacityBits;
        padByte ^= 0xEC ^ 0x11
      ) {
        appendBits(padByte, 8, bb)
      }

      // 按大端序将位打包为字节
      const dataCodewords: byte[] = []
      while (dataCodewords.length * 8 < bb.length) {
        dataCodewords.push(0)
      }
      bb.forEach(
        (b: bit, i: int) => (dataCodewords[i >>> 3] |= b << (7 - (i & 7)))
      )

      // 创建 QR Code 对象
      return new QrCode(version, ecl, dataCodewords, mask)
    }

    /* -- 字段 -- */

    // 本 QR Code 的宽度与高度，以模块数计，介于
    // 21 到 177（含）之间。等于 version * 4 + 17。
    public readonly size: int

    // 本 QR Code 使用的掩模图案索引，介于 0 到 7（含）之间。
    // 即使创建 QR Code 时请求自动掩模（mask = -1），
    // 所得对象的 mask 值仍介于 0 到 7 之间。
    public readonly mask: int

    // 本 QR Code 的模块（false = 浅色，true = 深色）。
    // 构造函数结束后不可变。通过 getModule() 访问。
    private readonly modules: boolean[][] = []

    // 标记不参与掩模的功能模块。构造函数结束后弃用。
    private readonly isFunction: boolean[][] = []

    /* -- 构造函数（低层）与字段 -- */

    // 以给定版本号、
    // 纠错等级、数据码字字节与掩模号创建新的 QR Code。
    // 这是低层 API，大多数用户不应直接使用。
    // 中层 API 为 encodeSegments() 函数。
    public constructor(
      // 本 QR Code 的版本号，介于 1 到 40（含）之间。
      // 决定该条形码的尺寸。
      public readonly version: int,

      // 本 QR Code 使用的纠错等级。
      public readonly errorCorrectionLevel: QrCode.Ecc,

      dataCodewords: Readonly<byte[]>,

      msk: int
    ) {
      // 检查标量参数
      if (version < QrCode.MIN_VERSION || version > QrCode.MAX_VERSION) {
        throw new RangeError('Version value out of range')
      }
      if (msk < -1 || msk > 7) {
        throw new RangeError('Mask value out of range')
      }
      this.size = version * 4 + 17

      // 将两个网格初始化为 size*size 的 false 布尔数组
      const row: boolean[] = []
      for (let i = 0; i < this.size; i++) {
        row.push(false)
      }
      for (let i = 0; i < this.size; i++) {
        this.modules.push(row.slice()) // 初始全为浅色
        this.isFunction.push(row.slice())
      }

      // 计算 ECC，绘制模块
      this.drawFunctionPatterns()
      const allCodewords: byte[] = this.addEccAndInterleave(dataCodewords)
      this.drawCodewords(allCodewords)

      // 执行掩模
      if (msk === -1) {
        // 自动选择最佳掩模
        let minPenalty: int = 1000000000
        for (let i = 0; i < 8; i++) {
          this.applyMask(i)
          this.drawFormatBits(i)
          const penalty: int = this.getPenaltyScore()
          if (penalty < minPenalty) {
            msk = i
            minPenalty = penalty
          }
          this.applyMask(i) // 通过 XOR 撤销掩模
        }
      }
      this.mask = msk
      this.applyMask(msk) // 应用最终选定的掩模
      this.drawFormatBits(msk) // 覆盖旧的格式位

      this.isFunction = []
    }

    /* -- 访问器方法 -- */

    // 返回给定坐标处模块（像素）的颜色，
    // 浅色为 false，深色为 true。左上角坐标为 (x=0, y=0)。
    // 若给定坐标越界，则返回 false（浅色）。
    public getModule(x: int, y: int): boolean {
      return (
        x >= 0 && x < this.size && y >= 0 && y < this.size && this.modules[y][x]
      )
    }

    // 经修改以暴露模块，便于访问
    public getModules(): boolean[][] {
      return this.modules
    }

    /* -- 构造函数的私有辅助方法：绘制功能模块 -- */

    // 读取本对象的 version 字段，绘制并标记所有功能模块。
    private drawFunctionPatterns(): void {
      // 绘制水平与垂直定时图案
      for (let i = 0; i < this.size; i++) {
        this.setFunctionModule(6, i, i % 2 === 0)
        this.setFunctionModule(i, 6, i % 2 === 0)
      }

      // 绘制 3 个定位图案（除右下角外的三个角；会覆盖部分定时模块）
      this.drawFinderPattern(3, 3)
      this.drawFinderPattern(this.size - 4, 3)
      this.drawFinderPattern(3, this.size - 4)

      // 绘制多个对齐图案
      const alignPatPos: int[] = this.getAlignmentPatternPositions()
      const numAlign: int = alignPatPos.length
      for (let i = 0; i < numAlign; i++) {
        for (let j = 0; j < numAlign; j++) {
          // 不要绘制在三个定位角上
          if (
            !(
              (i === 0 && j === 0)
              || (i === 0 && j === numAlign - 1)
              || (i === numAlign - 1 && j === 0)
            )
          ) {
            this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j])
          }
        }
      }

      // 绘制配置数据
      this.drawFormatBits(0) // 占位掩模值；稍后在构造函数中覆盖
      this.drawVersion()
    }

    // 绘制两份格式位副本（附带其自身的纠错码）
    // 基于给定掩模与本对象的纠错等级字段。
    private drawFormatBits(mask: int): void {
      // 计算纠错码并打包位
      const data: int = (this.errorCorrectionLevel.formatBits << 3) | mask // errCorrLvl 为 uint2，mask 为 uint3
      let rem: int = data
      for (let i = 0; i < 10; i++) {
        rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
      }
      const bits = ((data << 10) | rem) ^ 0x5412 // uint15

      // 绘制第一份副本
      for (let i = 0; i <= 5; i++) {
        this.setFunctionModule(8, i, getBit(bits, i))
      }
      this.setFunctionModule(8, 7, getBit(bits, 6))
      this.setFunctionModule(8, 8, getBit(bits, 7))
      this.setFunctionModule(7, 8, getBit(bits, 8))
      for (let i = 9; i < 15; i++) {
        this.setFunctionModule(14 - i, 8, getBit(bits, i))
      }

      // 绘制第二份副本
      for (let i = 0; i < 8; i++) {
        this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i))
      }
      for (let i = 8; i < 15; i++) {
        this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i))
      }
      this.setFunctionModule(8, this.size - 8, true) // 恒为深色
    }

    // 绘制两份版本位副本（附带其自身的纠错码），
    // 基于本对象的 version 字段，当且仅当 7 <= version <= 40 时绘制。
    private drawVersion(): void {
      if (this.version < 7) {
        return
      }

      // 计算纠错码并打包位
      let rem: int = this.version // version 为 uint6，范围 [7, 40]
      for (let i = 0; i < 12; i++) {
        rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25)
      }
      const bits: int = (this.version << 12) | rem // uint18

      // 绘制两份副本
      for (let i = 0; i < 18; i++) {
        const color: boolean = getBit(bits, i)
        const a: int = this.size - 11 + (i % 3)
        const b: int = Math.floor(i / 3)
        this.setFunctionModule(a, b, color)
        this.setFunctionModule(b, a, color)
      }
    }

    // 绘制 9*9 定位图案（含边界分隔符），
    // 中心模块位于 (x, y)。模块可越界。
    private drawFinderPattern(x: int, y: int): void {
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const dist: int = Math.max(Math.abs(dx), Math.abs(dy)) // 切比雪夫/无穷范数
          const xx: int = x + dx
          const yy: int = y + dy
          if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) {
            this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4)
          }
        }
      }
    }

    // 绘制 5*5 对齐图案，中心模块
    // 位于 (x, y)。所有模块必须在边界内。
    private drawAlignmentPattern(x: int, y: int): void {
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          this.setFunctionModule(
            x + dx,
            y + dy,
            Math.max(Math.abs(dx), Math.abs(dy)) !== 1
          )
        }
      }
    }

    // 设置模块颜色并将其标记为功能模块。
    // 仅供构造函数使用。坐标必须在边界内。
    private setFunctionModule(x: int, y: int, isDark: boolean): void {
      this.modules[y][x] = isDark
      this.isFunction[y][x] = true
    }

    /* -- 构造函数的私有辅助方法：码字与掩模 -- */

    // 返回新的字节串：在给定数据后追加相应纠错
    // 码字，基于本对象的版本号与纠错等级。
    private addEccAndInterleave(data: Readonly<byte[]>): byte[] {
      const ver: int = this.version
      const ecl: QrCode.Ecc = this.errorCorrectionLevel
      if (data.length !== QrCode.getNumDataCodewords(ver, ecl)) {
        throw new RangeError('Invalid argument')
      }

      // 计算参数值
      const numBlocks: int
        = QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver]
      const blockEccLen: int = QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver]
      const rawCodewords: int = Math.floor(QrCode.getNumRawDataModules(ver) / 8)
      const numShortBlocks: int = numBlocks - (rawCodewords % numBlocks)
      const shortBlockLen: int = Math.floor(rawCodewords / numBlocks)

      // 将数据拆分为多个块，并为每个块追加 ECC
      const blocks: byte[][] = []
      const rsDiv: byte[] = QrCode.reedSolomonComputeDivisor(blockEccLen)
      for (let i = 0, k = 0; i < numBlocks; i++) {
        const dat: byte[] = data.slice(
          k,
          k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1)
        )
        k += dat.length
        const ecc: byte[] = QrCode.reedSolomonComputeRemainder(dat, rsDiv)
        if (i < numShortBlocks) {
          dat.push(0)
        }
        blocks.push(dat.concat(ecc))
      }

      // 将各块的字节交错（而非拼接）为单一序列
      const result: byte[] = []
      for (let i = 0; i < blocks[0].length; i++) {
        blocks.forEach((block, j) => {
          // 跳过短块中的填充字节
          if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
            result.push(block[i])
          }
        })
      }
      return result
    }

    // 将给定的 8 位码字序列（数据与纠错）绘制到 QR Code 的整个
    // 数据区。调用本方法前需先标记出功能模块。
    private drawCodewords(data: Readonly<byte[]>): void {
      if (
        data.length
        !== Math.floor(QrCode.getNumRawDataModules(this.version) / 8)
      ) {
        throw new RangeError('Invalid argument')
      }
      let i: int = 0 // 数据中的位索引
      // 执行特殊的锯齿形扫描
      for (let right = this.size - 1; right >= 1; right -= 2) {
        // 每对列中右列的索引
        if (right === 6) {
          right = 5
        }
        for (let vert = 0; vert < this.size; vert++) {
          // 垂直计数器
          for (let j = 0; j < 2; j++) {
            const x: int = right - j // 实际 x 坐标
            const upward: boolean = ((right + 1) & 2) === 0
            const y: int = upward ? this.size - 1 - vert : vert // 实际 y 坐标
            if (!this.isFunction[y][x] && i < data.length * 8) {
              this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7))
              i++
            }
            // 若本 QR Code 存在剩余位（0 到 7 位），它们已被构造函数设为
            // 0/false/浅色，本方法保持不变
          }
        }
      }
    }

    // 将本 QR Code 的码字模块与给定掩模图案做 XOR。
    // 掩模前必须先标记功能模块并绘制码字位。
    // 由于 XOR 的运算性质，以同一掩模值再次调用 applyMask()
    // 将撤销掩模。最终规范的
    // QR Code 恰好需要应用一次掩模（不能是 0 次、2 次等）。
    private applyMask(mask: int): void {
      if (mask < 0 || mask > 7) {
        throw new RangeError('Mask value out of range')
      }
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          let invert: boolean
          switch (mask) {
            case 0:
              invert = (x + y) % 2 === 0
              break
            case 1:
              invert = y % 2 === 0
              break
            case 2:
              invert = x % 3 === 0
              break
            case 3:
              invert = (x + y) % 3 === 0
              break
            case 4:
              invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0
              break
            case 5:
              invert = ((x * y) % 2) + ((x * y) % 3) === 0
              break
            case 6:
              invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0
              break
            case 7:
              invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0
              break
            default:
              throw new Error('Unreachable')
          }
          if (!this.isFunction[y][x] && invert) {
            this.modules[y][x] = !this.modules[y][x]
          }
        }
      }
    }

    // 基于本 QR Code 当前模块状态计算并返回惩罚分。
    // 自动选掩模算法使用它来找到得分最低的掩模图案。
    private getPenaltyScore(): int {
      let result: int = 0

      // 行内相邻同色模块，以及类定位图案
      for (let y = 0; y < this.size; y++) {
        let runColor = false
        let runX = 0
        const runHistory = [0, 0, 0, 0, 0, 0, 0]
        for (let x = 0; x < this.size; x++) {
          if (this.modules[y][x] === runColor) {
            runX++
            if (runX === 5) {
              result += QrCode.PENALTY_N1
            }
            else if (runX > 5) {
              result++
            }
          }
          else {
            this.finderPenaltyAddHistory(runX, runHistory)
            if (!runColor) {
              result
                += this.finderPenaltyCountPatterns(runHistory) * QrCode.PENALTY_N3
            }
            runColor = this.modules[y][x]
            runX = 1
          }
        }
        result
          += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory)
            * QrCode.PENALTY_N3
      }
      // 列内相邻同色模块，以及类定位图案
      for (let x = 0; x < this.size; x++) {
        let runColor = false
        let runY = 0
        const runHistory = [0, 0, 0, 0, 0, 0, 0]
        for (let y = 0; y < this.size; y++) {
          if (this.modules[y][x] === runColor) {
            runY++
            if (runY === 5) {
              result += QrCode.PENALTY_N1
            }
            else if (runY > 5) {
              result++
            }
          }
          else {
            this.finderPenaltyAddHistory(runY, runHistory)
            if (!runColor) {
              result
                += this.finderPenaltyCountPatterns(runHistory) * QrCode.PENALTY_N3
            }
            runColor = this.modules[y][x]
            runY = 1
          }
        }
        result
          += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory)
            * QrCode.PENALTY_N3
      }

      // 2*2 的同色模块块
      for (let y = 0; y < this.size - 1; y++) {
        for (let x = 0; x < this.size - 1; x++) {
          const color: boolean = this.modules[y][x]
          if (
            color === this.modules[y][x + 1]
            && color === this.modules[y + 1][x]
            && color === this.modules[y + 1][x + 1]
          ) {
            result += QrCode.PENALTY_N2
          }
        }
      }

      // 深色与浅色模块的平衡度
      let dark: int = 0
      for (const row of this.modules) {
        dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark)
      }
      const total: int = this.size * this.size // 注意 size 为奇数，故 dark/total != 1/2
      // 计算最小的整数 k >= 0，使 (45-5k)% <= dark/total <= (55+5k)%
      const k: int = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1
      result += k * QrCode.PENALTY_N4
      return result
    }

    /* -- 私有辅助函数 -- */

    // 返回本版本号对齐图案位置的升序列表。
    // 每个位置都在 [0,177) 范围内，同时用于 x 轴与 y 轴。
    // 也可实现为含 40 个变长整数列表的查找表。
    private getAlignmentPatternPositions(): int[] {
      if (this.version === 1) {
        return []
      }
      else {
        const numAlign: int = Math.floor(this.version / 7) + 2
        const step: int
          = this.version === 32
            ? 26
            : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2
        const result: int[] = [6]
        for (let pos = this.size - 7; result.length < numAlign; pos -= step) {
          result.splice(1, 0, pos)
        }
        return result
      }
    }

    // 返回给定版本号的 QR Code 在
    // 排除所有功能模块后可存储的数据位数（含剩余位，故不一定是 8 的倍数）。
    // 结果范围为 [208, 29648]。也可实现为 40 项查找表。
    private static getNumRawDataModules(ver: int): int {
      if (ver < QrCode.MIN_VERSION || ver > QrCode.MAX_VERSION) {
        throw new RangeError('Version number out of range')
      }
      let result: int = (16 * ver + 128) * ver + 64
      if (ver >= 2) {
        const numAlign: int = Math.floor(ver / 7) + 2
        result -= (25 * numAlign - 10) * numAlign - 55
        if (ver >= 7) {
          result -= 36
        }
      }
      return result
    }

    // 返回任意给定版本号与纠错等级的 QR Code 所含 8 位数据（即非纠错）
    // 码字数量（丢弃剩余位）。
    // 这个无状态纯函数也可实现为 (40*4) 单元查找表。
    private static getNumDataCodewords(ver: int, ecl: QrCode.Ecc): int {
      return (
        Math.floor(QrCode.getNumRawDataModules(ver) / 8)
        - QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver]
        * QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver]
      )
    }

    // 返回给定次数的 Reed-Solomon ECC 生成多项式。也可
    // 对所有可能参数值用查找表实现，而非算法。
    private static reedSolomonComputeDivisor(degree: int): byte[] {
      if (degree < 1 || degree > 255) {
        throw new RangeError('Degree out of range')
      }
      // 多项式系数按幂次从高到低存储，恒为 1 的首项除外。
      // 例如多项式 x^3 + 255x^2 + 8x + 93 存储为 uint8 数组 [255, 8, 93]。
      const result: byte[] = []
      for (let i = 0; i < degree - 1; i++) {
        result.push(0)
      }
      result.push(1) // 从单项式 x^0 开始

      // 计算乘积多项式 (x - r^0) * (x - r^1) * (x - r^2) * ... * (x - r^{degree-1})，
      // 并舍去恒为 1x^degree 的最高次单项式项。
      // 注意 r = 0x02，它是域 GF(2^8/0x11D) 的生成元。
      let root = 1
      for (let i = 0; i < degree; i++) {
        // 将当前乘积乘以 (x - r^i)
        for (let j = 0; j < result.length; j++) {
          result[j] = QrCode.reedSolomonMultiply(result[j], root)
          if (j + 1 < result.length) {
            result[j] ^= result[j + 1]
          }
        }
        root = QrCode.reedSolomonMultiply(root, 0x02)
      }
      return result
    }

    // 返回给定数据多项式与除式多项式对应的 Reed-Solomon 纠错码字。
    private static reedSolomonComputeRemainder(
      data: Readonly<byte[]>,
      divisor: Readonly<byte[]>
    ): byte[] {
      const result: byte[] = divisor.map(_ => 0)
      for (const b of data) {
        // 多项式除法
        const factor: byte = b ^ (result.shift() as byte)
        result.push(0)
        divisor.forEach(
          (coef, i) => (result[i] ^= QrCode.reedSolomonMultiply(coef, factor))
        )
      }
      return result
    }

    // 返回两个给定域元素在模 GF(2^8/0x11D) 下的乘积。参数与结果
    // 均为无符号 8 位整数。也可实现为 256*256 项 uint8 查找表。
    private static reedSolomonMultiply(x: byte, y: byte): byte {
      if (x >>> 8 !== 0 || y >>> 8 !== 0) {
        throw new RangeError('Byte out of range')
      }
      // 俄罗斯农民乘法
      let z: int = 0
      for (let i = 7; i >= 0; i--) {
        z = (z << 1) ^ ((z >>> 7) * 0x11D)
        z ^= ((y >>> i) & 1) * x
      }
      return z
    }

    // 只能在刚添加一段浅色连续串后调用，返回
    // 0、1 或 2。是 getPenaltyScore() 的辅助函数。
    private finderPenaltyCountPatterns(runHistory: Readonly<int[]>): int {
      const n: int = runHistory[1]
      const core: boolean
        = n > 0
          && runHistory[2] === n
          && runHistory[3] === n * 3
          && runHistory[4] === n
          && runHistory[5] === n
      return (
        (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0)
        + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0)
      )
    }

    // 必须在模块一行（行或列）结束时调用。是 getPenaltyScore() 的辅助函数。
    private finderPenaltyTerminateAndCount(
      currentRunColor: boolean,
      currentRunLength: int,
      runHistory: int[]
    ): int {
      if (currentRunColor) {
        // 结束深色连续串
        this.finderPenaltyAddHistory(currentRunLength, runHistory)
        currentRunLength = 0
      }
      currentRunLength += this.size // 为最后一段连续串添加浅色边界
      this.finderPenaltyAddHistory(currentRunLength, runHistory)
      return this.finderPenaltyCountPatterns(runHistory)
    }

    // 将给定值压入前端并丢弃最后一个值。是 getPenaltyScore() 的辅助函数。
    private finderPenaltyAddHistory(
      currentRunLength: int,
      runHistory: int[]
    ): void {
      if (runHistory[0] === 0) {
        currentRunLength += this.size
      } // 为初始连续串添加浅色边界
      runHistory.pop()
      runHistory.unshift(currentRunLength)
    }

    /* -- 常量与表 -- */

    // QR Code Model 2 标准支持的最小版本号。
    public static readonly MIN_VERSION: int = 1
    // QR Code Model 2 标准支持的最大版本号。
    public static readonly MAX_VERSION: int = 40

    // 供 getPenaltyScore() 在评估最佳掩模时使用。
    private static readonly PENALTY_N1: int = 3
    private static readonly PENALTY_N2: int = 3
    private static readonly PENALTY_N3: int = 40
    private static readonly PENALTY_N4: int = 10

    private static readonly ECC_CODEWORDS_PER_BLOCK: int[][] = [
      // 版本：（注意索引 0 用于填充，被设为非法值）
      // 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    纠错等级
      [
        -1,
        7,
        10,
        15,
        20,
        26,
        18,
        20,
        24,
        30,
        18,
        20,
        24,
        26,
        30,
        22,
        24,
        28,
        30,
        28,
        28,
        28,
        28,
        30,
        30,
        26,
        28,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30
      ], // 低
      [
        -1,
        10,
        16,
        26,
        18,
        24,
        16,
        18,
        22,
        22,
        26,
        30,
        22,
        22,
        24,
        24,
        28,
        28,
        26,
        26,
        26,
        26,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28,
        28
      ], // 中
      [
        -1,
        13,
        22,
        18,
        26,
        18,
        24,
        18,
        22,
        20,
        24,
        28,
        26,
        24,
        20,
        30,
        24,
        28,
        28,
        26,
        30,
        28,
        30,
        30,
        30,
        30,
        28,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30
      ], // 四分
      [
        -1,
        17,
        28,
        22,
        16,
        22,
        28,
        26,
        26,
        24,
        28,
        24,
        28,
        22,
        24,
        24,
        30,
        28,
        28,
        26,
        28,
        30,
        24,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30
      ] // 高
    ]

    private static readonly NUM_ERROR_CORRECTION_BLOCKS: int[][] = [
      // 版本：（注意索引 0 用于填充，被设为非法值）
      // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    纠错等级
      [
        -1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        4,
        4,
        4,
        4,
        4,
        6,
        6,
        6,
        6,
        7,
        8,
        8,
        9,
        9,
        10,
        12,
        12,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        19,
        20,
        21,
        22,
        24,
        25
      ], // 低
      [
        -1,
        1,
        1,
        1,
        2,
        2,
        4,
        4,
        4,
        5,
        5,
        5,
        8,
        9,
        9,
        10,
        10,
        11,
        13,
        14,
        16,
        17,
        17,
        18,
        20,
        21,
        23,
        25,
        26,
        28,
        29,
        31,
        33,
        35,
        37,
        38,
        40,
        43,
        45,
        47,
        49
      ], // 中
      [
        -1,
        1,
        1,
        2,
        2,
        4,
        4,
        6,
        6,
        8,
        8,
        8,
        10,
        12,
        16,
        12,
        17,
        16,
        18,
        21,
        20,
        23,
        23,
        25,
        27,
        29,
        34,
        34,
        35,
        38,
        40,
        43,
        45,
        48,
        51,
        53,
        56,
        59,
        62,
        65,
        68
      ], // 四分
      [
        -1,
        1,
        1,
        2,
        4,
        4,
        4,
        5,
        6,
        8,
        8,
        11,
        11,
        16,
        16,
        18,
        16,
        19,
        21,
        25,
        25,
        25,
        34,
        30,
        32,
        35,
        37,
        40,
        42,
        45,
        48,
        51,
        54,
        57,
        60,
        63,
        66,
        70,
        74,
        77,
        81
      ] // 高
    ]
  }

  // 将给定值的指定位数低位
  // 追加到给定缓冲区。要求 0 <= len <= 31 且 0 <= val < 2^len。
  function appendBits(val: int, len: int, bb: bit[]): void {
    if (len < 0 || len > 31 || val >>> len !== 0) {
      throw new RangeError('Value out of range')
    }
    for (
      let i = len - 1;
      i >= 0;
      i-- // 逐位追加
    ) {
      bb.push((val >>> i) & 1)
    }
  }

  // 当且仅当 x 的第 i 位为 1 时返回 true。
  function getBit(x: int, i: int): boolean {
    return ((x >>> i) & 1) !== 0
  }

  /* ---- 数据段类 ---- */

  /*
   * QR Code 符号中的字符/二进制/控制数据段。
   * 该类的实例不可变。
   * 创建段的中层方式是取负载数据
   * 并调用 QrSegment.makeNumeric() 等静态工厂函数。
   * 创建段的低层方式是自行构造位缓冲区
   * 并以合适的值调用 QrSegment() 构造函数。
   * 本段类本身不限制长度，但 QR Code 有长度限制。
   * 即使在最有利的条件下，一个 QR Code 最多也只能容纳 7089 个字符的数据。
   * 任何超过此长度的段对于生成 QR Code 都没有意义。
   */
  export class QrSegment {
    /* -- 静态工厂函数（中层） -- */

    // 返回以字节模式编码给定二进制数据的
    // 段。接受任意输入字节数组。任何文本字符串
    // 都可转换为 UTF-8 字节并编码为字节模式段。
    public static makeBytes(data: Readonly<byte[]>): QrSegment {
      const bb: bit[] = []
      for (const b of data) {
        appendBits(b, 8, bb)
      }
      return new QrSegment(QrSegment.Mode.BYTE, data.length, bb)
    }

    // 返回以数字模式编码给定十进制数字串的段。
    public static makeNumeric(digits: string): QrSegment {
      if (!QrSegment.isNumeric(digits)) {
        throw new RangeError('String contains non-numeric characters')
      }
      const bb: bit[] = []
      for (let i = 0; i < digits.length;) {
        // 每次迭代最多取 3 位数字
        const n: int = Math.min(digits.length - i, 3)
        appendBits(Number.parseInt(digits.substr(i, n), 10), n * 3 + 1, bb)
        i += n
      }
      return new QrSegment(QrSegment.Mode.NUMERIC, digits.length, bb)
    }

    // 返回以字母数字模式编码给定文本串的段。
    // 允许的字符为：0 到 9、A 到 Z（仅大写）、空格、
    // 美元符号、百分号、星号、加号、连字符、句点、斜杠、冒号。
    public static makeAlphanumeric(text: string): QrSegment {
      if (!QrSegment.isAlphanumeric(text)) {
        throw new RangeError(
          'String contains unencodable characters in alphanumeric mode'
        )
      }
      const bb: bit[] = []
      let i: int
      for (i = 0; i + 2 <= text.length; i += 2) {
        // 按每 2 个一组处理
        let temp: int
          = QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45
        temp += QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1))
        appendBits(temp, 11, bb)
      }
      if (i < text.length) {
        // 剩余 1 个字符
        appendBits(
          QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)),
          6,
          bb
        )
      }
      return new QrSegment(QrSegment.Mode.ALPHANUMERIC, text.length, bb)
    }

    // 返回一个新的可变列表，含零个或多个段，用于表示给定 Unicode 文本串。
    // 结果可能使用多种段模式并切换模式，以优化位流长度。
    public static makeSegments(text: string): QrSegment[] {
      // 自动选择最高效的段编码方式
      if (text === '') {
        return []
      }
      else if (QrSegment.isNumeric(text)) {
        return [QrSegment.makeNumeric(text)]
      }
      else if (QrSegment.isAlphanumeric(text)) {
        return [QrSegment.makeAlphanumeric(text)]
      }
      else {
        return [QrSegment.makeBytes(QrSegment.toUtf8ByteArray(text))]
      }
    }

    // 返回表示扩展通道解释
    //（ECI）指定符的段，携带给定赋值。
    public static makeEci(assignVal: int): QrSegment {
      const bb: bit[] = []
      if (assignVal < 0) {
        throw new RangeError('ECI assignment value out of range')
      }
      else if (assignVal < 1 << 7) {
        appendBits(assignVal, 8, bb)
      }
      else if (assignVal < 1 << 14) {
        appendBits(0b10, 2, bb)
        appendBits(assignVal, 14, bb)
      }
      else if (assignVal < 1000000) {
        appendBits(0b110, 3, bb)
        appendBits(assignVal, 21, bb)
      }
      else {
        throw new RangeError('ECI assignment value out of range')
      }
      return new QrSegment(QrSegment.Mode.ECI, 0, bb)
    }

    // 测试给定字符串能否以数字模式编码为段。
    // 当且仅当每个字符都在 0 到 9 范围内时，字符串可编码。
    public static isNumeric(text: string): boolean {
      return QrSegment.NUMERIC_REGEX.test(text)
    }

    // 测试给定字符串能否以字母数字模式编码为段。
    // 当且仅当每个字符都属于以下集合时，字符串可编码：0 到 9、A 到 Z
    //（仅大写）、空格、美元符号、百分号、星号、加号、连字符、句点、斜杠、冒号。
    public static isAlphanumeric(text: string): boolean {
      return QrSegment.ALPHANUMERIC_REGEX.test(text)
    }

    /* -- 构造函数（低层）与字段 -- */

    // 以给定属性与数据创建新的 QR Code 段。
    // 字符数（numChars）必须与模式及位缓冲区长度一致，
    // 但不校验该约束。给定位缓冲区会被克隆后存储。
    public constructor(
      // 本段的模式指示符。
      public readonly mode: QrSegment.Mode,

      // 本段未编码数据的长度。数字/字母数字/汉字模式以字符计，
      // 字节模式以字节计，ECI 模式为 0。
      // 恒为零或正数，与数据的位长度不同。
      public readonly numChars: int,

      // 本段的数据位。通过 getData() 访问。
      private readonly bitData: bit[]
    ) {
      if (numChars < 0) {
        throw new RangeError('Invalid argument')
      }
      this.bitData = bitData.slice() // 做防御性拷贝
    }

    /* -- 方法 -- */

    // 返回本段数据位的新拷贝。
    public getData(): bit[] {
      return this.bitData.slice() // 做防御性拷贝
    }

    //（包私有）计算并返回在给定版本号下编码给定各段所需的位数。
    // 若某段字符过多、无法装入其长度字段，则结果为无穷大。
    public static getTotalBits(
      segs: Readonly<QrSegment[]>,
      version: int
    ): number {
      let result: number = 0
      for (const seg of segs) {
        const ccbits: int = seg.mode.numCharCountBits(version)
        if (seg.numChars >= 1 << ccbits) {
          return Infinity
        } // 该段长度无法装入字段的位宽
        result += 4 + ccbits + seg.bitData.length
      }
      return result
    }

    // 返回表示给定字符串 UTF-8 编码的新字节数组。
    private static toUtf8ByteArray(str: string): byte[] {
      str = encodeURI(str)
      const result: byte[] = []
      for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) !== '%') {
          result.push(str.charCodeAt(i))
        }
        else {
          result.push(Number.parseInt(str.substr(i + 1, 2), 16))
          i += 2
        }
      }
      return result
    }

    /* -- 常量 -- */

    // 精确描述所有可在数字模式下编码的字符串。
    private static readonly NUMERIC_REGEX: RegExp = /^[0-9]*$/

    // 精确描述所有可在字母数字模式下编码的字符串。
    private static readonly ALPHANUMERIC_REGEX: RegExp = /^[A-Z0-9 $%*+./:-]*$/

    // 字母数字模式下所有合法字符的集合，
    // 其中每个字符的值映射为该字符串中的索引。
    private static readonly ALPHANUMERIC_CHARSET: string
      = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'
  }
}

/* ---- 公共辅助枚举 ---- */
namespace qrcodegen.QrCode {
  type int = number

  /*
   * QR Code 符号中的纠错等级。不可变。
   */
  export class Ecc {
    /* -- 常量 -- */

    public static readonly LOW = new Ecc(0, 1) // QR Code 约可容忍 7% 的错误码字
    public static readonly MEDIUM = new Ecc(1, 0) // QR Code 约可容忍 15% 的错误码字
    public static readonly QUARTILE = new Ecc(2, 3) // QR Code 约可容忍 25% 的错误码字
    public static readonly HIGH = new Ecc(3, 2) // QR Code 约可容忍 30% 的错误码字

    /* -- 构造函数与字段 -- */

    private constructor(
      // 范围为 0 到 3（无符号 2 位整数）。
      public readonly ordinal: int,
      //（包私有）范围为 0 到 3（无符号 2 位整数）。
      public readonly formatBits: int
    ) {}
  }
}

/* ---- 公共辅助枚举 ---- */
namespace qrcodegen.QrSegment {
  type int = number

  /*
   * 描述如何解释一段的数据位。不可变。
   */
  export class Mode {
    /* -- 常量 -- */

    public static readonly NUMERIC = new Mode(0x1, [10, 12, 14])
    public static readonly ALPHANUMERIC = new Mode(0x2, [9, 11, 13])
    public static readonly BYTE = new Mode(0x4, [8, 16, 16])
    public static readonly KANJI = new Mode(0x8, [8, 10, 12])
    public static readonly ECI = new Mode(0x7, [0, 0, 0])

    /* -- 构造函数与字段 -- */

    private constructor(
      // 模式指示位，为 uint4 值（范围 0 到 15）。
      public readonly modeBits: int,
      // 三个不同版本范围对应的字符计数字段位数。
      private readonly numBitsCharCount: [int, int, int]
    ) {}

    /* -- 方法 -- */

    //（包私有）返回给定版本号下，该模式段的
    // 字符计数字段位宽。结果范围为 [0, 16]。
    public numCharCountBits(ver: int): int {
      return this.numBitsCharCount[Math.floor((ver + 7) / 17)]
    }
  }
}

export default qrcodegen
