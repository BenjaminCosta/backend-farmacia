import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Políticas de Privacidad</h1>
        
        <Card className="mb-6">
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Información que Recopilamos</h2>
              <p className="text-muted-foreground">
                En Farmacia Russo, recopilamos información personal cuando realizás una compra,
                creás una cuenta o te comunicás con nosotros. Esta información puede incluir:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Nombre completo y datos de contacto (email, teléfono)</li>
                <li>Dirección de envío y facturación</li>
                <li>Información de pago (procesada de forma segura)</li>
                <li>Historial de compras y preferencias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Uso de la Información</h2>
              <p className="text-muted-foreground">
                Utilizamos tu información personal para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Procesar y entregar tus pedidos</li>
                <li>Comunicarnos contigo sobre tu cuenta o pedidos</li>
                <li>Mejorar nuestros productos y servicios</li>
                <li>Enviar información promocional (con tu consentimiento)</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Protección de Datos</h2>
              <p className="text-muted-foreground">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu
                información personal contra acceso no autorizado, pérdida, destrucción o alteración.
                Utilizamos cifrado SSL para todas las transacciones en línea.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Compartir Información</h2>
              <p className="text-muted-foreground">
                No vendemos ni alquilamos tu información personal a terceros. Podemos compartir
                información con:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Proveedores de servicios que nos ayudan a operar nuestro negocio</li>
                <li>Servicios de envío para entregar tus pedidos</li>
                <li>Autoridades cuando sea requerido por ley</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cookies y Tecnologías Similares</h2>
              <p className="text-muted-foreground">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro
                sitio web, analizar el tráfico y personalizar el contenido. Podés configurar tu
                navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Tus Derechos</h2>
              <p className="text-muted-foreground">
                Tenés derecho a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Acceder a tu información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de tu información</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Retirar tu consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Menores de Edad</h2>
              <p className="text-muted-foreground">
                Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos
                intencionalmente información personal de menores sin el consentimiento de sus
                padres o tutores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cambios a esta Política</h2>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de modificar esta política de privacidad en cualquier
                momento. Los cambios serán efectivos inmediatamente después de su publicación en
                nuestro sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contacto</h2>
              <p className="text-muted-foreground">
                Si tenés preguntas sobre esta política de privacidad o sobre cómo manejamos tu
                información personal, podés contactarnos en:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: privacidad@farmaciarusso.com.ar<br />
                Teléfono: (011) 4567-8900<br />
                Dirección: Av. Corrientes 1234, C1043 CABA
              </p>
            </section>

            <div className="pt-4 text-sm text-muted-foreground">
              Última actualización: {new Date().toLocaleDateString('es-AR')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
