<template>
  <div
    class="svg-icon svg-external-icon"
    v-if="isExt"
    :style="styleExternalIcon"
    v-on="listeners"
  ></div>
  <svg v-else :class="svgClass" aria-hidden="true" v-on="listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import { isExternal } from '@/utils/validate'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      require: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props, { attrs }) {
    console.log('attrs', attrs)
    const isExt = computed(() => isExternal(props.iconClass))
    const iconName = computed(() => `#icon-${props.iconClass}`)
    const svgClass = computed(() =>
      props.className ? `svg-icon ${props.className}` : 'svg-icon'
    )
    const styleExternalIcon = computed(() => ({
      mask: `url(${props.iconClass}) no-repeat 50% 50%`,
      '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
    }))

    const listeners = computed(() => {
      const fns = {}
      Object.keys(attrs).forEach(key => {
        if (key.startsWith('on')) {
          fns[key] = attrs[key]
        }
      })
      return fns
    })

    return {
      isExt,
      iconName,
      svgClass,
      styleExternalIcon,
      listeners
    }
  }
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
