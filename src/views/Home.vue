<template>
  <div class="container">
    <loading :active.sync="status.isLoading"></loading>
    <nav
      class="navbar navbar-expand-lg navbar-light bg-primary justify-content-between"
    >
      <a class="navbar-brand" href="#">Taichung</a>
      <div class="input-group navbar-searchbar border-bottom">
        <div class="input-group-prepend ">
          <button
            class="btn btn-outline-secondary border-0"
            type="button"
            id="button-addon2"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
        <input
          type="text"
          class="form-control border-0 bg-transparent searchbar"
          placeholder="Explore your favorite attractions"
          v-model="search"
        />
      </div>
    </nav>
    <div class="container">
      <div class="row">
        <sidebar
          :zoneData="zone"
          @selectCategories="selectCategories"
          @addRule="addRule"
        ></sidebar>
        <div class="col">
          <dataList
            :datalist="filterData"
            :screenRule="screenRule"
            :totalPage="totalPage"
            :currentPage="currentPage"
            :qtyPage="qtyPage"
            @delRule="delRule"
            @goPage="goPage"
            @prePage="currentPage -= 1"
            @nextPage="currentPage += 1"
          ></dataList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import sidebar from '../components/Sidebar'
import dataList from '../components/DataList'
export default {
  name: 'home',
  data () {
    return {
      data: [], // Ajax 資料儲存
      filtered: [],
      status: {
        isLoading: false // 頁面 loading 效果變數
      },
      categories: '全部地區',
      // park: false,
      // ticket: false,
      screenRule: [], // sidebar 篩選條件
      search: '', // searchbar 輸入的文字
      currentPage: 1, // 當前頁碼
      totalPage: '', // 依 filterData 進行計算的頁碼總數
      qtyPage: 10, // 欲在頁面上渲染的頁碼數，如顯示頁碼 1-10 就好
      qtyData: 10, // 每頁欲顯示的資料筆數
      goToPage: '', // 頁碼點擊的資料
      minData: '', // 計算每頁第一筆資料的 index
      maxData: '' // 計算每頁最後一筆資料的 index
    }
  },
  components: {
    sidebar,
    dataList
  },
  methods: {
    // Ajax 台中觀光局 OpenData 趣味景點 JSON 檔
    getData () {
      const vm = this
      vm.status.isLoading = true
      vm.$http
        .get(
          'http://datacenter.taichung.gov.tw/swagger/OpenData/8d85a5fb-74b5-40ea-9dce-878f1dad272a'
        )
        .then(res => {
          vm.status.isLoading = false
          vm.data = res.data
          vm.totalPage = Math.ceil(vm.data.length / vm.qtyData)
          vm.minData = vm.currentPage * vm.qtyData - vm.qtyData + 1
          vm.maxData = vm.currentPage * vm.qtyData
          // console.log('總頁數：', vm.totalPage, '當前頁碼：', vm.currentPage, '每頁資料數：', vm.qtyData, '每頁第一筆：', vm.minData, '每頁最後一筆：', vm.maxData)
        })
    },
    // sidebar emit 觸發地區條件篩選
    selectCategories (res) {
      this.categories = res
    },
    // sidebar emit 觸發條件篩選添加
    addRule (res) {
      this.screenRule = res
    },
    // sidebar emit 觸發條件篩選取消
    delRule (res) {
      this.screenRule.splice(this.screenRule.indexOf(res), 1)
    },
    goPage (res) {
      // console.log(res)
      this.currentPage = res
    }
  },
  computed: {
    // 自動計算列出 data 中的所有地區
    zone () {
      // 這邊先抓取 JSON資料中的地區資料並建立新的陣列
      let rawData = this.data.map(item => {
        return item['鄉鎮市區']
      })
      // console.log(rawData)
      let zoneData = rawData.filter((item, i, arr) => {
        if (arr.indexOf(item) === i) {
          return item
        }
      })
      zoneData.unshift('全部地區')
      return zoneData
    },
    // 做 data list 資料渲染的處理
    filterData () {
      const vm = this
      // let filtered
      // --------- 地區篩選  ----------
      if (vm.categories === '全部地區') {
        vm.filtered = vm.data
        // vm.currentPage = 1
      } else {
        vm.filtered = vm.data.filter(item => {
          return item['鄉鎮市區'] === vm.categories
        })
        // vm.currentPage = 1
      }
      // --------- 條件篩選  ----------
      if (vm.screenRule.length > 0) {
        // console.log(vm.filtered)
        vm.screenRule.forEach(rule => {
          vm.filtered = vm.filtered.filter((item, index, arr) => {
            // console.log(!!item[rule], index, rule)
            return !!item[rule]
          })
          // console.log(vm.filtered)
        })
      }
      // --------- SearchBar篩選  ----------
      if (vm.search) {
        vm.filtered = vm.filtered.filter((item, index, arr) => {
          // 這邊只要有 searchbar 中的字串與資料中的 '名稱' 或 '鄉鎮市區' 中的字串有部分符合的就會進行篩選
          return item['名稱'].indexOf(vm.search) > -1 || item['鄉鎮市區'].indexOf(vm.search) > -1
        })
      }
      // 在以上條件過濾後重新計算總頁數
      vm.totalPage = Math.ceil(vm.filtered.length / vm.qtyData)
      // console.log('總頁數：', vm.totalPage, '當前頁碼：', vm.currentPage, '每頁資料數：', vm.qtyData, '每頁第一筆：', vm.minData, '每頁最後一筆：', vm.maxData)
      // --------- 頁碼篩選  ----------
      // 以下限制每頁顯示的資料數
      let cacheData = []
      vm.filtered.forEach((item, index, array) => {
        let num = index + 1
        if (num >= vm.minData && num <= vm.maxData) {
          cacheData.push(item)
        }
      })
      return cacheData
    }
  },
  watch: {
    // 監視當前頁碼進行第1筆與最後1筆資料的 index 渲染位置計算
    currentPage () {
      const vm = this
      if (vm.currentPage >= vm.totalPage) {
        vm.minData = vm.currentPage * vm.qtyData - vm.qtyData + 1
        vm.maxData = vm.filtered.length
      } else {
        vm.minData = vm.currentPage * vm.qtyData - vm.qtyData + 1
        vm.maxData = vm.currentPage * vm.qtyData
      }
    },
    // 當新增條件篩選時初始化渲染
    screenRule () {
      this.currentPage = 1
    },
    // 當新增條件篩選時初始化渲染
    categories () {
      this.currentPage = 1
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
