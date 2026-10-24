import type { PropType } from 'vue'
import { defineComponent, h, onMounted, ref } from 'vue'
import { NFadeInExpandTransition } from '../../_internal'
import NMessage from './Message'
import { messageProps } from './message-props'

export default defineComponent({
  name: 'MessageEnvironment',
  props: {
    ...messageProps,
    duration: {
      type: Number,
      default: 3000
    },
    onAfterLeave: Function,
    onLeave: Function,
    internalKey: {
      type: String,
      required: true
    },
    // 私有
    onInternalAfterLeave: Function as PropType<(key: string) => void>,
    // 已废弃
    onHide: Function,
    onAfterHide: Function
  },
  setup(props) {
    let timerId: number | null = null
    const showRef = ref<boolean>(true)
    onMounted(() => {
      setHideTimeout()
    })
    function setHideTimeout(): void {
      const { duration } = props
      if (duration) {
        timerId = window.setTimeout(hide, duration)
      }
    }
    function handleMouseenter(e: MouseEvent): void {
      if (e.currentTarget !== e.target)
        return
      if (timerId !== null) {
        window.clearTimeout(timerId)
        timerId = null
      }
    }
    function handleMouseleave(e: MouseEvent): void {
      if (e.currentTarget !== e.target)
        return
      setHideTimeout()
    }
    function hide(): void {
      const { onHide } = props
      showRef.value = false
      if (timerId) {
        window.clearTimeout(timerId)
        timerId = null
      }
      // 已废弃
      if (onHide)
        onHide()
    }
    function handleClose(): void {
      const { onClose } = props
      if (onClose)
        onClose()
      hide()
    }
    function handleAfterLeave(): void {
      const { onAfterLeave, onInternalAfterLeave, onAfterHide, internalKey }
        = props
      if (onAfterLeave)
        onAfterLeave()
      if (onInternalAfterLeave)
        onInternalAfterLeave(internalKey)
      // 已废弃
      if (onAfterHide)
        onAfterHide()
    }
    // 已废弃
    function deactivate(): void {
      hide()
    }

    return {
      show: showRef,
      hide,
      handleClose,
      handleAfterLeave,
      handleMouseleave,
      handleMouseenter,
      deactivate
    }
  },
  render() {
    return (
      <NFadeInExpandTransition
        appear
        onAfterLeave={this.handleAfterLeave}
        onLeave={this.onLeave}
      >
        {{
          default: () => [
            this.show ? (
              <NMessage
                content={this.content}
                type={this.type}
                icon={this.icon}
                showIcon={this.showIcon}
                closable={this.closable}
                spinProps={this.spinProps}
                onClose={this.handleClose}
                onMouseenter={
                  this.keepAliveOnHover ? this.handleMouseenter : undefined
                }
                onMouseleave={
                  this.keepAliveOnHover ? this.handleMouseleave : undefined
                }
              />
            ) : null
          ]
        }}
      </NFadeInExpandTransition>
    )
  }
})
