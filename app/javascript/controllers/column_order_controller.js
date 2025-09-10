// app/javascript/controllers/column_order_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["header", "orderField"]
  
    connect() {
      // Binding happens in target lifecycle to survive Turbo frame rerenders
    }

    headerTargetConnected(element) {
      element.draggable = true
      this._onDragStart ||= this.onDragStart.bind(this)
      this._onDragOver  ||= this.onDragOver.bind(this)
      this._onDrop      ||= this.onDrop.bind(this)
      element.addEventListener("dragstart", this._onDragStart)
      element.addEventListener("dragover", this._onDragOver)
      element.addEventListener("drop", this._onDrop)
    }

    headerTargetDisconnected(element) {
      element.removeEventListener("dragstart", this._onDragStart)
      element.removeEventListener("dragover", this._onDragOver)
      element.removeEventListener("drop", this._onDrop)
    }
  
    onDragStart(e) {
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", e.target.dataset.col)
      this.draggedCol = e.target
    }
  
    onDragOver(e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
    }
  
    onDrop(e) {
      e.preventDefault()
      const from = this.draggedCol
      const to = e.currentTarget
      if (!from || from === to) return
  
      // Reorder DOM headers
      const parent = from.parentNode
      const fromIndex = Array.from(parent.children).indexOf(from)
      const toIndex   = Array.from(parent.children).indexOf(to)
  
      if (fromIndex < toIndex) {
        parent.insertBefore(from, to.nextSibling)
      } else {
        parent.insertBefore(from, to)
      }
  
      // Reorder each row's cells to match header move
      const table = this.element.querySelector("table") || this.element.closest("table")
      const bodyRows = table?.querySelectorAll("tbody tr") || []
      bodyRows.forEach(row => {
        const cells = row.children
        const movingCell = cells[fromIndex]
        if (!movingCell) return
        const referenceNode = fromIndex < toIndex ? cells[toIndex]?.nextSibling : cells[toIndex]
        row.insertBefore(movingCell, referenceNode || null)
      })

      // Update hidden field with new order and submit the form
      const newOrder = Array.from(parent.children).map(th => th.dataset.col)
      this.orderFieldTarget.value = newOrder.join(",")
      // Submit the GET form to re-render the table columns (server-side)
      this.element.closest("form")?.requestSubmit()
    }
  }
  