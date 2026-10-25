import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useLocaleName } from '../store'

export const loadingBarApiRef = {}

export default function createDemoRouter(app, routes) {
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  router.beforeEach((to, from, next) => {
    if (!from || to.path !== from.path) {
      if (loadingBarApiRef.value) {
        loadingBarApiRef.value.start()
      }
    }
    next()
  })

  router.afterEach((to, from) => {
    document.documentElement.lang = to.path.startsWith('/en-US')
      ? 'en-US'
      : 'zh-CN'
    if (!from || to.path !== from.path) {
      if (loadingBarApiRef.value) {
        loadingBarApiRef.value.finish()
      }
      if (to.hash && to.hash !== from.hash) {
        nextTick(() => {
          const el = document.querySelector(to.hash)
          if (el)
            el.scrollIntoView()
        })
      }
      nextTick(() => {
        const h1s = document.getElementsByTagName('h1')
        if (to.name !== 'home' && h1s.length !== 0) {
          document.title = `${h1s[0].textContent} - Naive UI`
        }
        else {
          // 在 index.html 中定义
          window.deriveTitleFromLocale(useLocaleName().value)
        }
      })
    }
  })

  return router
}
