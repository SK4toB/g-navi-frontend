<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/chat">Chat</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
nav ul {
  list-style: none;
  display: flex;
  gap: 10px;
}
nav ul li {
  display: inline;
}
</style>