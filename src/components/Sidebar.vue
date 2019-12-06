<template>
  <div class="sidebar-group sidebar-group-gray">
    <ul class="list-unstyled">
      <li class="sidebar-group-item">
        <div class="title">Location</div>
        <select
          class="selceted form-control"
          name="location"
          id="location"
          v-model="categories"
          @change="selectCategories"
        >
          <option value="" disabled selected>--請選擇地區--</option>
          <option
            v-for="(item, index) in zoneData"
            :key="index"
            :value="item"
            >{{ item }}</option
          >
        </select>
      </li>
      <!-- <li class="sidebar-group-item">
        <div class="title">Date</div>
        <div class="row justify-content-between align-items-center">
          <div class="col-2">
            <label for="from">from</label>
          </div>
          <div class="col-10">
            <input id="from" class="form-control" type="date" />
          </div>
        </div>
        <div class="row justify-content-between align-items-center">
          <div class="col-2">
            <label for="from" class="text-right">to</label>
          </div>
          <div class="col-10">
            <input id="to" class="form-control" type="date" />
          </div>
        </div>
      </li>-->
      <li class="sidebar-group-item">
        <div class="title">Categories</div>
        <div class="form-group form-check mb-0">
          <input
            type="checkbox"
            class="form-check-input"
            id="park"
            name="park"
            v-model="screenRule"
            value="停車資訊"
          />
          <label class="form-check-label" for="park">停車資訊</label>
        </div>
        <div class="form-group form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="ticket"
            name="ticket"
            v-model="screenRule"
            value="門票資訊"
          />
          <label class="form-check-label" for="ticket">門票資訊</label>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categories: '',
      screenRule: []
    }
  },
  props: ['zoneData'],
  methods: {
    // 利用emit將地區選擇往上一層帶
    selectCategories () {
      this.$emit('selectCategories', this.categories)
    }
  },
  watch: {
    // 利用 Watch 監視 screenRule變數，有變動時透過 emit 將條件往上一層帶
    screenRule () {
      this.$emit('addRule', this.screenRule)
    }
  }
}
</script>
