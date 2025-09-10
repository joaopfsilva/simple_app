// Import and register all your controllers from the importmap via controllers/**/*_controller
import { application } from "controllers/application"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
eagerLoadControllersFrom("controllers", application)

// window.Stimulus = Application.start()
// const context = require.context(".", true, /_controller\.js$/)
// Stimulus.load(definitionsFromContext(context))
