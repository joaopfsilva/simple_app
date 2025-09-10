# db/seeds.rb
require "faker"
countries = %w[Australia Netherlands Portugal Germany Spain Italy UK USA Canada Brazil]

1000.times do
  User.create!(
    name: Faker::Name.name,
    email: Faker::Internet.email,
    phone: Faker::PhoneNumber.cell_phone_in_e164,
    country: countries.sample
  )
end

puts "Seeded #{User.count} users."
