# app/controllers/users_controller.rb
class UsersController < ApplicationController
  DEFAULT_COLUMNS = %w[name email phone country].freeze

  def index
    @columns = normalize_columns(params[:columns]&.split(",")) ||
               normalize_columns(session[:columns_order]) ||
               DEFAULT_COLUMNS
    session[:columns_order] = @columns

    @q = params[:q].to_s.strip

    @users = User.order(:name)
    if @q.present?
      like = "%#{@q}%"
      # Use ILIKE for case-insensitive search on Postgres
      @users = @users.where("name ILIKE ? OR email ILIKE ?", like, like)
    end

    @pagy, @users = pagy(@users, items: 20)

    respond_to do |format|
      format.html
      format.turbo_stream { render partial: "users/table", locals: { users: @users, columns: @columns } }
    end
  end

  private

  def normalize_columns(cols)
    return nil unless cols.present?

    (cols & DEFAULT_COLUMNS).presence
  end
end
