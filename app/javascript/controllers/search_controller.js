// app/javascript/controllers/search_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static values = { delay: { type: Number, default: 250 } }
  
    connect() { this.timer = null }
  
    input(event) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // submit the closest form (GET) which targets the turbo-frame
        event.target.form?.requestSubmit()
      }, this.delayValue)
    }
  }
  