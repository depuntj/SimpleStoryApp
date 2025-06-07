import { StoryModel } from "../../../models/story-model.js";
import { StoriesView } from "../../../views/stories-view.js";
import { StoriesPresenter } from "../../../presenters/stories-presenter.js";

export default class StoriesPage {
  constructor() {
    this.presenter = null;
  }

  async render() {
    return `
      <section class="stories-page">
        <div class="container">
          <header class="page-header">
            <h1>Dicoding Stories</h1>
            <p>Kumpulan cerita dari komunitas Dicoding</p>
            <a href="#/add" class="add-story-fab" aria-label="Tambah story baru">
              ➕
            </a>
          </header>
          
          <div class="stories-content">
            <div class="stories-list" id="stories-container" role="main">
            </div>
            
            <div class="map-section">
              <h2>Lokasi Stories</h2>
              <div id="map-container" class="map-container"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const model = new StoryModel();
    const view = new StoriesView();
    this.presenter = new StoriesPresenter(model, view);

    this.presenter.setupRetryHandler();
    await this.presenter.loadStories();
  }
}
