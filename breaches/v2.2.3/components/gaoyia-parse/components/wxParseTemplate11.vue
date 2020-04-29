<template>
  <!--判断是否是标签节点-->
  <block v-if="node.node == 'element'">
    <!--button类型-->
    <button v-if="node.tag == 'button'" type="default" size="mini" :class="node.classStr" :style="node.styleStr">
      <rich-text :nodes="node" :class="node.classStr" :style="'user-select:' + parseSelect" />
    </button>

    <!--a类型-->
    <view v-else-if="node.tag == 'a'" :class="node.classStr" :data-href="node.attr.href" :style="node.styleStr" @click="wxParseATap(node.attr,$event)">
      <block v-for="(node, index) of node.nodes" :key="index">
        <rich-text :nodes="node" :class="node.classStr" :style="'user-select:' + parseSelect" />
      </block>
    </view>

    <!--li类型-->
    <view v-else-if="node.tag == 'li'" :class="node.classStr" :style="node.styleStr">
      <block v-for="(node, index) of node.nodes" :key="index">
        <rich-text :nodes="node" :class="node.classStr" :style="'user-select:' + parseSelect" />
      </block>
    </view>

    <!--table类型-->
    <wx-parse-table v-else-if="node.tag == 'table'" :class="node.classStr" :style="node.styleStr" :node="node" />

    <!--br类型-->
    <!-- #ifndef H5 -->
    <text v-else-if="node.tag == 'br'">\n</text>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <br v-else-if="node.tag == 'br'">
    <!-- #endif -->

    <!--video类型-->
    <wx-parse-video v-else-if="node.tag == 'video'" :node="node" />

    <!--audio类型-->
    <wx-parse-audio v-else-if="node.tag == 'audio'" :node="node" />

    <!--img类型-->
    <wx-parse-img v-else-if="node.tag == 'img'" :node="node" />

    <!--其他标签-->
    <view v-else :class="node.classStr" :style="node.styleStr">
      <block v-for="(node, index) of node.nodes" :key="index">
        <rich-text :nodes="node" :class="node.classStr" :style="'user-select:' + parseSelect" />
      </block>
    </view>
  </block>

  <!--判断是否是文本节点-->
  <block v-else-if="node.node == 'text' ">{{ node.text }}</block>
</template>

<script>
import wxParseImg from './wxParseImg'
import wxParseVideo from './wxParseVideo'
import wxParseAudio from './wxParseAudio'
import wxParseTable from './wxParseTable'

export default {
  name: 'WxParseTemplate11',
  components: {
    wxParseImg,
    wxParseVideo,
    wxParseAudio,
    wxParseTable
  },
  props: {
    node: {}
  },
  methods: {
    wxParseATap(attr, e) {
      const {
        href
      } = e.currentTarget.dataset
      if (!href) return
      let parent = this.$parent
      while (!parent.preview || typeof parent.preview !== 'function') {
        parent = parent.$parent
      }
      parent.navigate(href, e, attr)
    }
  }
}
</script>
