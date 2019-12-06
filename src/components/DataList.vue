<template>
  <div class="datalist">
    <div class="d-flex py-3">
      <h5 class="mb-1 mr-1" v-for="(item, index) in screenRule" :key="index">
        <span
          class="badge badge-pill badge-primary py-2 px-3 d-flex align-items-center"
        >
          <span>{{ item }}</span>
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click="delRule(item)"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </span>
      </h5>
    </div>
    <div class="card mb-3" v-for="(item, index) in datalist" :key="index">
      <div class="row no-gutters">
        <div class="col-md-4">
          <img
            :src="`https://picsum.photos/600/600?random=${index}`"
            class="card-img"
            alt="景點圖片"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title text-primary">{{ item['名稱'] }}</h5>
            <p class="card-text">{{ item['簡述'] }}</p>
            <p class="card-text mb-1">
              地址：<small class="text-muted"
                >{{ item['鄉鎮市區'] }}{{ item['地址'] }}</small
              >
            </p>
            <p class="card-text mb-1" v-if="item['停車資訊']">
              停車資訊：<small class="text-muted">{{ item['停車資訊'] }}</small>
            </p>
            <p class="card-text mb-1" v-if="item['門票資訊']">
              門票資訊：<small class="text-muted">{{ item['門票資訊'] }}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!datalist.length">Sorry，沒有搜尋結果</div>
    <nav
      class="d-flex justify-content-center mt-3"
      v-if="pagination.length > 0"
    >
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage <= 1 }">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="prePage"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          v-for="item in pagination"
          :key="item"
          class="page-item"
          :class="{ active: item === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="goPage(item)">{{
            item
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage >= totalPage }">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="nextPage"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  // data () {
  //   return {}
  // },
  props: ['datalist', 'screenRule', 'totalPage', 'currentPage', 'qtyPage'],
  methods: {
    // 透過 emit 將取消的條件往外帶
    delRule (rule) {
      this.$emit('delRule', rule)
    },
    goPage (res) {
      // console.log(res)
      this.$emit('goPage', res)
    },
    prePage () {
      this.$emit('prePage')
      console.log('pre')
    },
    nextPage () {
      this.$emit('nextPage')
      console.log('next')
    }
  },
  computed: {
    pagination () {
      // console.log(this.totalPage, this.currentPage, this.qtyPage)
      let i = 0
      let arr = [] // 欲渲染的頁碼
      // 以下兩種條件成立時對頁碼進行調整
      // 當 totalPage 大於 qtyPage（若小於則會產生負數）且
      // 頁碼接近 totalPage 且小於 qtyPage 時則停止渲染 totalPage 以後的頁碼數
      if (this.totalPage - this.currentPage < 9 && this.totalPage > this.qtyPage) {
        while (i < 10) {
          arr.unshift(this.totalPage - i)
          i++
        }
      }
      // 當 totalPage 大於 qtyPage 時，currentPage 改變則重新調整頁碼
      if (this.totalPage >= this.qtyPage) {
        while (i < this.qtyPage) {
          arr.push(this.currentPage + i)
          i++
        }
      } else {
        // 以上條件皆未達成時，直接渲染 totalPage 的頁碼數即可
        while (i < this.totalPage) {
          arr.push(i + 1)
          i++
        }
      }
      console.log(arr)
      return arr
    }
  }
}
</script>
