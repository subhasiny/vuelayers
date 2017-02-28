import uuid from 'node-uuid'
import exposeInject from 'vuelayers/src/mixins/expose-inject'
import rxSubs from 'vuelayers/src/mixins/rx-subs'
import { consts as olConsts } from 'vuelayers/src/ol'

const props = {
  id: {
    type: String,
    default: uuid.v4()
  },
  opacity: {
    type: Number,
    default: 1
  },
  minResolution: Number,
  maxResolution: Number,
  visible: {
    type: Boolean,
    default: true
  },
  projection: {
    type: String,
    default: olConsts.MAP_PROJECTION
  },
  extent: {
    type: Array,
    validator: value => value.length === 4
  },
  zIndex: Number
}

const methods = {
  /**
   * Updates layer state
   */
  refresh () {
    this.layer.changed()
  },
  /**
   * @return {ol.layer.Layer}
   * @protected
   */
  createLayer () {
    throw new Error('Not implemented method')
  },
  expose () {
    return {
      ...this.$parent.expose(),
      layer: this.layer
    }
  }
}

const watch = {
  maxResolution (value) {
    this.layer.setMaxResolution(value)
  },
  minResolution (value) {
    this.layer.setMinResolution(value)
  },
  opacity (value) {
    this.layer.setOpacity(value)
  },
  visible (value) {
    this.layer.setVisible(value)
  }
}

export default {
  name: 'vl-layer',
  mixins: [ exposeInject, rxSubs ],
  inject: [ 'map' ],
  props,
  methods,
  watch,
  render (h) {
    return h('i', {
      style: {
        display: 'none'
      }
    }, this.$slots.default)
  },
  created () {
    /**
     * @type {ol.layer.Layer}
     * @protected
     */
    this.layer = this.createLayer()
    this.layer.vm = this
  },
  updated () {
    this.layer.changed()
  },
  mounted () {
    this.map.addLayer(this.layer)
  },
  beforeDestroy () {
    this.map.removeLayer(this.layer)
  },
  destroyed () {
    this.layer = undefined
  }
}