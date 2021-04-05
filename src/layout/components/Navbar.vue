<template>
  <div class="navbar">
    <hambuger  @toggleClick="toggleSidebar" :is-active="sidebar.opened"/>
    <breadcrumb />
    <div class="right-menu">
      <el-dropdown
        class="avatar-container right-menu-item hover-effect">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/profile/index">
              <el-dropdown-item>Profile</el-dropdown-item>
            </router-link>
            <router-link to="/">
              <el-dropdown-item>Dashboard</el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/Brolly0204/vue3-element-admin">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Hambuger from '@/components/Hambuger/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import { mapGetters } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'

export default defineComponent({
  components: {
    Hambuger,
    Breadcrumb
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const toggleSidebar = () => {
      store.dispatch('app/toggleSidebar')
    }

    const logout = async () => {
      await store.dispatch('user/logout')
      router.push({
        path: '/login',
        query: {
          redirect: route.fullPath
        }
      })
    }

    return {
      toggleSidebar,
      logout
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  }
})
</script>

<style lang="scss">
.navbar {
  position: relative;
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        position: relative;
        margin-top: 5px;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
