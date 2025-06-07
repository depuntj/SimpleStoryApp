import { StoryModel } from "../../../models/story-model.js";
import { AddStoryView } from "../../../views/add-story-view.js";
import { AddStoryPresenter } from "../../../presenters/add-story-presenter.js";
export default class AddStoryPage {
  constructor() {
    this.view = null;
    this.presenter = null;
  }

  async render() {
    this.view = new AddStoryView();
    return this.view.render();
  }

  async afterRender() {
    const model = new StoryModel();
    this.presenter = new AddStoryPresenter(model, this.view);

    this.view.initializeCamera();
    this.view.initializeMap();
    this.presenter.setupEventHandlers();
  }
}
