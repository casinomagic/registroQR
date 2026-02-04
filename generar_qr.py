import qrcode

# URL del registro
url = "https://casinomagic.github.io/registroQR/"

# Crear el QR
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Crear la imagen
img = qr.make_image(fill_color="black", back_color="white")

# Guardar
img.save("qr_registro_confluencia.png")
print("QR generado exitosamente: qr_registro_confluencia.png")
