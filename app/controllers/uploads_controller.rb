class UploadsController < ApplicationController
  protect_from_forgery with: :null_session
  def create
    head :ok
  end
end