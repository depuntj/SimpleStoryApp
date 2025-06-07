import StoriesPage from "../pages/stories/stories-page.js";
import AddStoryPage from "../pages/stories/add-story-page.js";
import AboutPage from "../pages/about/about-page.js";
import LoginPage from "../pages/auth/login-page.js";

const routes = {
  "/": new StoriesPage(),
  "/add": new AddStoryPage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
};

export default routes;
