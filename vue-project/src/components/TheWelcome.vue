<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
</script>

<template>
  <WelcomeItem>
      <template #icon>
          <EcosystemIcon />
      </template>
    <RouterLink :to="{name: 'login'}">
        <span>登入</span>
    </RouterLink>
  </WelcomeItem>

  <WelcomeItem>
      <template #icon>
          <EcosystemIcon />
      </template>
      <RouterLink :to="{name: 'register'}">
          <span>注册</span>
      </RouterLink>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
      <RouterLink :to="{name: 'parkingCard'}">
          <span>停车券</span>
      </RouterLink>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
      <RouterLink :to="{name: 'spider'}">
          <span>爬虫</span>
      </RouterLink>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>

  </WelcomeItem>
</template>
