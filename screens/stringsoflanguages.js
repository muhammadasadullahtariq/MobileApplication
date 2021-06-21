import React from "react";
import LocalizedStrings from "react-native-localization";
const strings = new LocalizedStrings({
  en: {
    //Login page strings
    sign_in: "Sign in",
    email_placeholder: " Email Address",
    password_placeholder: " Password",
    Login_btn_text: "Login",
    Forgot_password_text: "Forgot Password",
    sorry_text: "Don't have an account? ",
    sorry_reg_text: "Register",

    //profile page strings
    myfavourites_txt: "Favourites",
    general: "General",
    reset_password: "Reset Password",
    first_name: "First Name",
    last_name: "Last Name",
    phone: "phone",
    update_profile: "Update Profile",
    old_password: "Old Password",
    new_password: "New Password",
    confirm_password: "Confirm Password",
    update_password: "Update Password",
    do_you_want_to_logout: "Do you want to logout?",
    profile_something_went_wrong: "Something went wrong",
    enter_a_valid_phone_number: "Enter Valid Phone Number!",
    please_fill_all_mandatory_fields: "Please fill all mandatory fields.",
    password_must_be:
      "Password must be atleast six characters with one number, one lowercase and one uppercase letter! ",
    password_mismatch: "Password mismatch! ",
    password_cannote_be_empty: "password can't be empty",
    updated_successfully: "Updated Successfully",
    error_on_while_uploading: "Error on while uploading,Try again",
    yes: "YES",
    no: "NO",
    logout: "Logout",

    //Forgot page string
    forgot_your_password: "FORGOT YOUR PASSWORD?",
    enter_your_email_below_to_receive: "Enter your email below to receive",
    the_instructions_to_reset_your: "the instructions to reset your",
    forgot_password: "password",
    email_address: "EMAIL ADDRESS",
    send_otp: "SEND OTP",

    //Register page strings
    register: "Register",
    already_have_an_account: "Already have an account?",
    register_firstname: " First Name",
    register_lastname: " Last Name",
    register_email_address: " Email Address",
    register_phone: " Phone Number",
    register_password: " Password",
    register_confirm_password: " Confirm Password",

    //Reset Password page string

    reset_password: " Reset Password",
    new_pass_placeholder: " New Password",
    confirm_pass_placeholder: " Confirm Password",
    reset: "Reser",
    close: "Close",

    //Splashscreen page strings

    moving_things_forward: "Moving things forward.",

    //otp page strings

    enter_otp: "Enter OTP",
    enter_the_code_you_have_received_by: "Enter the code you have received by",
    email_in_order_to_verify_account: "E-mail in order to verify account",

    //cart page strings
    payment_failed: "Payment Failed",
    cart_is_empty: "Sorry, your cart is empty",
    cash: "Cash",
    cart: "Cart",
    payment_mode: "Payment Mode",
    cart_something_went_wrong: "Some thing went Wrong",
    quantity_available: " this item available :(",
    only: "Sorry! There isn't any more of",
    food_cost: "Food Cost",
    total_cost: "TOTAL COST",
    personal_details: "Personal Details",
    delivery_location: "Delivery Location",
    add_or_change: "Edit",
    plot_no1: "Plot.No/Landmark - ",
    notes_optional: "Notes(Optional)",
    Write_your_notes_here: "Write your notes here",
    coupon: "Coupon:",
    apply: "APPLY",
    invalid_coupon: "Invalid Coupon",
    enter_coupon_code: "Enter coupon code",
    coupon_applied: "Coupon Applied",
    delivery_charge: "Delivery Charge",
    table_price: "Table Price",
    table_no: "Table Number",
    no_of_persons: "Number of Persons",
    //Success Page strings

    success: "Success",
    done: "Done",
    success_text: "Your order has been processed successfully and will be on its way to you shortly.",
    succes_text2: "Your table has been booked successfully",

    //Restaurant List

    restaurant_list: "Restaurant List",
    search_for_what_you_need: "Search for what you need...",
    show_all: "Show All",
    retry: "Retry",
    sorry_no_data_available: "Sorry no data available ...",
    closed: "Closed",
    delivery: "Delivery",
    exit: "Do you want to exit?",
    exit_app: "Exit App?",
    free_delivery: "Free Delivery",

    //RestaurantDetail page strings

    menu: "MENU",
    location: "Locate",
    contact: "Contact",
    order_menu: "ORDER MENU",
    res_details_eatt: "Eatt",
    about_restaurant: "About",
    view_all: "View all",
    reviews: "Reviews",

    //Menu page strings

    all_categories: "All",

    //MenuOption page strings

    add_to_cart: "Add to Cart",

    //Filter page strings

    filters: "Filters",
    filters_reset: "Reset",
    rating_stars: "Rating",
    price_range: "Price range",
    distance_from_current_location: "Distance from current location",
    food_type: "Food type",
    low: "Low",
    high: "High",
    nearest: "Nearest",
    longest: "Longest",
    all: "All",
    veg: "Veg",
    apply_filter: "Apply Filter",

    //Address page strings

    add_new_address: "Add New Address",
    enter_location: "Enter Location",
    note_select_address_from_autocomplete:
      "Note : Select address from autocomplete",
    plot_no2: "Plot No/Apartment/Landmark",
    specification: "Specification",
    choose_your_language: "Choose your location",
    save_and_update: "SAVE",
    home: "Home",
    office: "Office",
    other: "Other",

    //Manage address page strings

    default: "Default",
    set_us_default: "Set Default",
    plot_no: "Plot.No/Landmark -",
    remove: "Remove",
    manage_address: "Manage Address",
    add_new_address_btn: "ADD NEW",
    saved_address: "SAVED ADDRESS",
    sorry_no_data_available: "Sorry no data available ...",
    address_deleted_successfully: "Address Deleted Successfully",
    removed_successfully: "Removed successfully",
    manage_something_went_wrong: "Something went wrong",
    no_address: "No address found",

    //Review page strings

    read_more: "Read more...",
    menus: "MENUS",
    reviews: "REVIEWS",

    //Booking page strings

    order_id: "Order Id :",
    eta: "ETA",
    for_further_queries_text: "Get in touch to enquire",
    is_on_the_way_text: "is on the way",
    view_restaurant_details: "Restaurant Details ",
    pending: "Pending",
    assigned: "Assigned",
    on_the_way: "On The Way",
    nos: "",
    delivered: "Delivered",
    menu_details: "Menu Details",
    items: "Items",
    qty: "Qty",
    restaurant_details: "Restaurant Details",
    estimating: "Estimating...",

    //Customer review page strings

    thank_you_for_your_feedback: "Thank you for your feedback.",
    cus_rev_something_went_wrong: "Something went wrong",
    phone: "Phone:",
    order_summary: "Order Summary",
    order_summary_small_letters: "Order Summary",
    your_order: "Your Order",
    sub_total: "Sub Total",
    total_cost: "Total Cost",
    order_details: "Order Details",
    order_id: "ORDER ID",
    submit: "SUBMIT",
    later_text: "Later",
    order_date: "ORDER DATE",
    payment: "PAYMENT",
    rate_order: "Rate Order",
    your_revies_help_others_order_on_app_text:
      "Your review helps others that order on dely to find their own favorite products and help our great cookers to grow.",
    how_was_the_delivery: "How was the delivery?",
    how_was_the_food: "How was the food?",
    how_was_the_service: "How was the service?",
    comment: "Comment",
    type_your_text_here: "Type your text here...",
    pending_review: "Pending Review",
    approved: "Approved",

    //Reservation review page strings
    reservation_details: "Reservation Details",
    reservation_guests: "Guests",
    reservation_date: "Date",
    rate_reservation: "Rate Reservation",
    reservation_time: "Time",
    reservation_guest_count: "Guest Count",
    reservation_summary: "RESERVATION SUMMARY",
    reservation_summary_small: "Reservation Summary",
    reservataion_how_was_the_item: "How was Items?",
    reservataion_how_was_the_service: "How was Service?",
    reservation_your_revies_help_others_order_on_app_text:
      "Your review helps others that order on dely to find their own favorite products and help our great cookers to grow.",
    reservation_cancelled: "Cancelled",
    reservation_completed: "Completed",
    reservation_pending: "Pending",
    reservation_confirmed: "Confirmed",

    //Search page strings
    search_restaurants: "Search Restaurants",
    show_all: "Show All",
    sorry_no_data_available: "Sorry no data available...",
    currently_unavailable: "Currently Unavailable",

    //Order history page strings
    location_access_required: "Location Access Required",
    app_needs_to_access_your_location_for_tracking:
      "Pizzjuan needs to Access your location for tracking",
    you_must_login_to_view_this_page: "You must Login to view this page",
    sorry_no_data_available: "Sorry no data available...",
    waiting_for_restaurant_confirmation: "Waiting for restaurant confirmation",
    restaurant_confirmed_your_order: "Restaurant Confirmed your order",
    your_order_cancelled: "Your order cancelled",
    view_your_order_details: "View Order Details",
    track_on_your_order: "Track your Order",
    ongoing_orders: "Ongoing Orders",
    previous_orders: "Previous Orders",
    country_issue: "Unable to open, Order is from other country",

    //favourites page strings

    fav_something_went_wrong: "Something went wrong",
    currently_unavailable: "Currently Unavailable",
    my_favourites: "Favourites",
    sorry_no_data_available: "Sorry no data available ...",
    show_all: "Show All",

    //Table Booking page strings

    table_for: "Table for",
    view_cart: "View Cart",
    people: "people",
    done: "Done",
    place_order: "PLACE ORDER",

    //app
    tab_Home: "Home",
    tab_cart: "Cart",
    tab_My_Orders: "My Orders",
    tab_Profile: "Profile",
  },
  es: {
    //Login page strings
    sign_in: "REGISTRARSE",
    email_placeholder: "EMAIL",
    password_placeholder: "CONTRASEÑA.",
    Login_btn_text: "INICIAR SESIÓN",
    Forgot_password_text: "He olvidado mi contraseña",
    sorry_text: "No tengo cuenta abierta",
    sorry_reg_text: "Registrarse",

    //profile page strings
    myfavourites_txt: "Mis favoritos",
    general: "General",
    reset_password: "Restablecer la contraseña",
    first_name: "Nombre",
    last_name: "Apellido",
    phone: "teléfono",
    update_profile: "Actualizar perfil'",
    old_password: "Contraseña anterior",
    new_password: "Nueva contraseña",
    confirm_password: "Confirmar contraseña",
    update_password: "Actualizar contraseña",
    profile_something_went_wrong: "Algo ha salido mal",
    enter_a_valid_phone_number: "¡Introducir un número de teléfono válido!",
    please_fill_all_mandatory_fields:
      "Por favor, completa los campos obligatorios",
    password_must_be:
      "La contraseña debe tener al menos 6 caracteres y al menos un número, una minúscula y una mayúscula",
    password_mismatch: "!Las contraseñas no coinciden¡",
    password_cannote_be_empty: "la contraseña no puede estar vacía",
    updated_successfully: "Actualizado correctamente",
    do_you_want_to_logout: "¿Quieres cerrar la sesión ?.",
    error_on_while_uploading: "Error subiendo, inténtalo de nuevo",
    yes: "Sí",
    no: "No",
    logout: "Cerrar sesión",

    //Forgot page string
    forgot_your_password: "¿HAS OLVIDADO TU CONTRASEÑA?",
    enter_your_email_below_to_receive: "Introduce tu email para recibir",
    the_instructions_to_reset_your: "las instrucciones para restablecer tu",
    forgot_password: "contraseña",
    email_address: "EMAIL",
    send_otp: "Enviar OTP",

    //Register page strings
    register: "REGISTRARSE",
    already_have_an_account: "¿Ya tienes una cuenta?",
    register_firstname: "NOMBRE",
    register_lastname: "APELLIDO",
    register_email_address: "EMAIL",
    register_phone: "TELÉFONO",
    register_password: "CONTRASEÑA",
    register_confirm_password: "CONFIRMAR CONTRASEÑA",

    //Reset Password page string
    reset_password: "Restablecer la contraseña",
    new_pass_placeholder: "Nueva contraseña",
    confirm_pass_placeholder: "Confirmar contraseña",
    reset: "REINICIALIZAR",
    close: "Cerrar",

    //Splashscreen page strings
    food_ordering_and_delivery: "Pedidos de comida a domicilio",

    //otp page strings
    enter_otp: "Introduzca OTP",
    enter_the_code_you_have_received_by:
      "Introduce el código que has recibido por",
    email_in_order_to_verify_account: "email para verificar la cuenta",

    //cart page strings
    payment_failed: "El pago ha fallado",
    payment_mode: "FORMA DE PAGO",
    cart_is_empty: "No hay nada en tu carrito de la compra",
    cash: "Efectivo",
    cart: "Carrito de la compra",
    cart_something_went_wrong: "Algo ha salido mal",
    quantity_available: "cantidad disponible",
    only: "Solamente",
    food_cost: "Precio de la comida",
    total_cost: "IMPORTE",
    personal_details: "Detalles personales",
    delivery_location: "Lugar de entrega",
    add_or_change: "Añadir / Modificar",
    plot_no1: "Piso/Letra/Otros detalles",
    notes_optional: "Notas(Opcionales)",
    Write_your_notes_here: "Escribe tus notas aquí",
    coupon: "cupón",
    apply: "aplicar",
    invalid_coupon: "Cupón inválido",
    enter_coupon_code: "Introduce el código de cupón",
    coupon_applied: "cupón aplicado",
    delivery_charge: "gastos de envío",
    table_price: "Tarifa de reserva",
    table_no: "Número de mesa",
    no_of_persons: "Número de personas",

    //Success Page strings
    success: "ÉXITO",
    done: "HECHO",
    succes_text2: "Su mesa ha sido reservada con éxito",

    //Restaurant List
    restaurant_list: "Lista de restaurantes",
    search_for_restaurants_and_foods: "Buscar restaurantes y comida",
    show_all: "Mostrar todo",
    retry: "Reintentar",
    sorry_no_data_available: "En este momento no hay datos disponibles ...",
    currently_unavailable: "Actualmente no disponible",
    starts_from: "Comienza desde",

    //RestaurantDetail page strings
    menu: "MENÚ",
    location: "UBICACIÓN",
    contact: "CONTACTO",
    order_menu: "MENÚ PARA PEDIDOS",
    res_details_eatt: "eatt",
    about_restaurant: "Acerca del restaurante",
    reviews: "Comentarios",
    view_all: "Ver todo",

    //Menu page strings
    all_categories: "Todas las categorías",

    //MenuOption page strings
    add_to_cart: "Añadir al carrito -",

    //Filter page strings
    filters: "Filtros",
    filters_reset: "Quitar",
    rating_stars: "Clasificación estrellas",
    price_range: "Rango de precios",
    distance_from_current_location: "Distancia desde la ubicación actual",
    food_type: "Tipo de comida",
    low: "Bajo",
    high: "Alto",
    nearest: "Más cercano",
    longest: "Más lejano",
    all: "Todos",
    veg: "Vegano",
    apply_filter: "Aplicar filtro",

    //Address page strings
    add_new_address: "AGREGAR NUEVA DIRECCIÓN",
    enter_location: "Indicar la dirección",
    note_select_address_from_autocomplete:
      "Nota: selecciona la dirección de Autocompletar",
    plot_no2: "Piso/Letra/Otros detalles",
    specification: "Especificación",
    choose_your_language: "Escoje tu ubicación",
    save_and_update: "Guardar y actualizar",
    home: "Casa",
    office: "Oficina",
    other: "Otro",

    //Manage address page strings
    default: "Defecto",
    set_us_default: "Establecer por defecto",
    plot_no3: "Piso/Letra/Otros detalles",
    remove: "Eliminar",
    manage_address: "Gestionar direcciones",
    add_new_address: "AGREGAR NUEVA DIRECCIÓN",
    saved_address: "DIRECCIÓN GUARDADA",
    sorry_no_data_available: "En este momento no hay datos disponibles ...",
    address_deleted_successfully: "Dirección eliminada correctamente",
    removed_successfully: "Eliminado con éxito",
    manage_something_went_wrong: "Algo ha salido mal",

    //Review page strings
    read_more: "Leer más...",
    menus: "MENÚS",
    reviews: "COMENTARIOS",

    //Booking page strings
    order_id: "Solicitar ID",
    eta: "ETA",
    for_further_queries_text: "Contactar con el repartidor",
    is_on_the_way_text: "está de camino",
    view_restaurant_details: "Ver detalles del restaurante",
    pending: "Pendiente",
    assigned: "Asignado",
    on_the_way: "está de camino",
    delivered: "Entregado",
    menu_details: "DETALLES DEL MENÚ",
    items: "Artículos",
    nos: "ud",
    qty: "Cant.",
    restaurant_details: "Detalles del restaurante",
    estimating: "estimando",

    //Customer review page strings

    thank_you_for_your_feedback: "Gracias por tus comentarios.",
    cus_rev_something_went_wrong: "Algo ha salido mal",
    phone: "Teléfono",
    order_summary: "RESUMEN DEL PEDIDO",
    order_summary_small_letters: "Resumen del pedido",
    your_order: "Tu pedido",
    sub_total: "Sub total",
    total_cost: "Importe",
    order_details: "Detalles del pedido",
    submit: "ENVIAR",
    later_text: "Valorar en otro momento",
    order_id: "ID del Pedido",
    order_date: "FECHA DEL PEDIDO",
    payment: "PAGO",
    rate_order: "Valorar pedido",
    your_revies_help_others_order_on_app_text:
      "Sus comentarios ayudan a otros a ordeattn Eatt para encontrar la felicidad de sus propios productos y ayudar a nuestros negocios de restaurantes a crecer.",
    how_was_the_delivery: "¿Cómo fue la entrega?",
    how_was_the_product: "¿Cómo fue el producto?",
    how_was_the_service: "¿Cómo fue el servicio?",
    comment: "Comentario",
    type_your_text_here: "Escribe tu texto aquí...",
    pending_review: "Revisión pendiente",
    approved: "Aprobado",

    //Reservation review page strings
    reservation_details: "detalles de la reserva",
    reservation_guests: "Invitados",
    reservation_date: "Fecha",
    rate_reservation: "Reserva de tarifas",
    reservation_time: "Hora",
    reservation_guest_count: "Cuenta de invitados",
    reservation_summary: "RESUMEN DE RESERVAS",
    reservation_summary_small: "Resumen De Reservas",
    reservataion_how_was_the_item: "¿Cómo estuvo el artículo?",
    reservataion_how_was_the_service: "¿Cómo fue el servicio?",
    reservation_your_revies_help_others_order_on_app_text:
      "Sus comentarios ayudan a otros a reservar en eatt para encontrar la felicidad de sus propios productos y ayudar a nuestros negocios de restaurantes a crecer.",
    reservation_cancelled: "Cancelado",
    reservation_completed: "Terminado",
    reservation_pending: "Pendiente",
    reservation_confirmed: "Confirmado",
    //Search page strings

    search_restaurants: "Buscar Restaurantes",
    show_all: "Mostrar todo",
    sorry_no_data_available: "En este momento no hay datos disponibles ...",
    currently_unavailable: "Actualmente no disponible",

    //Order history page strings
    location_access_required: "Es necesario conocer tu ubicación",
    app_needs_to_access_your_location_for_tracking:
      "Es necesario acceder a tu ubicación para hacer el seguimiento'",
    you_must_login_to_view_this_page:
      "Debes iniciar sesión para ver esta página",
    sorry_no_data_available: "En este momento no hay datos disponibles ...",
    waiting_for_restaurant_confirmation:
      "Esperando la confirmación del restaurante",
    restaurant_confirmed_your_order: "El restaurante ha confirmado tu pedido",
    your_order_cancelled: "Tu pedido ha sido cancelado",
    view_your_order_details: "Ver detalles del pedido",
    track_on_your_order: "Seguimiento de tu pedido'",
    ongoing_orders: "Pedidos en curso",
    previous_orders: "Pedidos anteriores",

    //favourites page strings
    fav_something_went_wrong: "Algo ha salido mal",
    currently_unavailable: "Actualmente no disponible",
    my_favourites: "Mis favoritos",
    sorry_no_data_available: "En este momento no hay datos disponibles ...",
    show_all: "Mostrar todo",

    //Table Booking page strings
    table_for: "Tabla de",
    view_cart: "Ver el carrito",
    people: "personas",
    done: "Hecho",
    place_order: "REALIZAR PEDIDO",
    tab_Home: "Inicio",
    tab_cart: "Carrito",
    tab_My_Orders: "Mis pedidos",
    tab_Profile: "Perfil",

    //app
    do_you_want_to_logout: "¿Quieres salir?",
    error_on_while_uploading: "Error al subir, inténtalo de nuevo",
    logout: "Cerrar sesión",
    success_text: "Tu pedido ha sido procesado con éxito",
    no_address: "No se ha encontrado dirección",
    exit: "¿Quieres salir?",
    exit_app: "¿Salir de la aplicación?",

    Pending: "Pendiente",
    Delivered: "Entregado",
    Cancelled: "cancelado",
    DeliveryAssign: "Asignado",
    PickedUpDeliveryontheWay: "está de camino",
  },
});
export default strings;
