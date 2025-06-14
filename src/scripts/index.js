import "../styles/styles.css";
import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const content = document.querySelector("#main-content");
  const drawerButton = document.querySelector("#drawer-button");
  const navigationDrawer = document.querySelector("#navigation-drawer");

  if (!content) {
    console.error("Main content element not found");
    return;
  }

  const app = new App({
    content,
    drawerButton,
    navigationDrawer,
  });

  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
