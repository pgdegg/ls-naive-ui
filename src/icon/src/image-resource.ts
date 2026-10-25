const resources = new WeakMap<
  SVGElement,
  {
    source: string
    loaded: Promise<boolean>
  }
>()

export function loadIconImage(resource: SVGElement): Promise<boolean> {
  const source = resource.dataset.src
  if (!source)
    return Promise.resolve(true)
  const cached = resources.get(resource)
  if (cached?.source === source)
    return cached.loaded
  const loaded = new Promise<boolean>((resolve) => {
    const ImageConstructor = resource.ownerDocument.defaultView?.Image
    const image = ImageConstructor ? new ImageConstructor() : undefined
    function finish(success: boolean): void {
      resource.removeEventListener('load', onLoad)
      resource.removeEventListener('error', onError)
      image?.removeEventListener('load', onLoad)
      image?.removeEventListener('error', onError)
      resolve(success)
    }
    function onLoad(): void {
      finish(true)
    }
    function onError(): void {
      finish(false)
    }
    resource.addEventListener('load', onLoad)
    resource.addEventListener('error', onError)
    image?.addEventListener('load', onLoad)
    image?.addEventListener('error', onError)
    resource.setAttribute('href', source)
    // An SVG image inside an unreferenced symbol may never start loading.
    if (image)
      image.src = source
  })
  resources.set(resource, { source, loaded })
  return loaded
}
