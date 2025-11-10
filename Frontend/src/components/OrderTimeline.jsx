import { Package, Truck, CheckCircle, Clock, XCircle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const OrderTimeline = ({ status, deliveryMethod }) => {
  // Mapeo de estados
  const statusMap = {
    'PENDING': 0,
    'CONFIRMED': 1,
    'PROCESSING': 2,
    'COMPLETED': 3,
    'CANCELLED': -1
  };

  const currentStep = statusMap[status] || 0;
  const isCancelled = status === 'CANCELLED';
  const isPickup = deliveryMethod === 'PICKUP';

  // Pasos para envío a domicilio
  const deliverySteps = [
    { 
      label: 'Pedido Recibido', 
      icon: Package, 
      color: 'blue',
      description: 'Tu pedido fue confirmado'
    },
    { 
      label: 'En Preparación', 
      icon: Clock, 
      color: 'orange',
      description: 'Estamos preparando tu pedido'
    },
    { 
      label: 'En Camino', 
      icon: Truck, 
      color: 'purple',
      description: 'Tu pedido está en ruta'
    },
    { 
      label: 'Entregado', 
      icon: CheckCircle, 
      color: 'green',
      description: 'Pedido completado'
    }
  ];

  // Pasos para retiro en farmacia
  const pickupSteps = [
    { 
      label: 'Pedido Recibido', 
      icon: Package, 
      color: 'blue',
      description: 'Tu pedido fue confirmado'
    },
    { 
      label: 'Listo para Retirar', 
      icon: Home, 
      color: 'orange',
      description: 'Ya podés pasar a retirarlo'
    },
    { 
      label: 'Retirado', 
      icon: CheckCircle, 
      color: 'green',
      description: 'Pedido completado'
    }
  ];

  const steps = isPickup ? pickupSteps : deliverySteps;

  const getStepColor = (step, index) => {
    if (isCancelled) return 'gray';
    if (index < currentStep) return step.color;
    if (index === currentStep) return step.color;
    return 'gray';
  };

  const isStepActive = (index) => {
    if (isCancelled) return false;
    return index <= currentStep;
  };

  const isStepCurrent = (index) => {
    if (isCancelled) return false;
    return index === currentStep;
  };

  return (
    <div className="w-full py-6">
      {isCancelled ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-red-900">Pedido Cancelado</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Este pedido ha sido cancelado
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Línea de progreso de fondo */}
          <div className="absolute top-10 left-0 w-full h-1 bg-gray-200 hidden md:block" 
               style={{ zIndex: 0 }} />
          
          {/* Línea de progreso activa */}
          <div 
            className="absolute top-10 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700 ease-out hidden md:block"
            style={{ 
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
              zIndex: 1
            }}
          />

          {/* Pasos */}
          <div className="relative grid gap-4 md:gap-0 md:grid-cols-4 lg:grid-cols-4"
               style={{ 
                 gridTemplateColumns: isPickup 
                   ? 'repeat(3, minmax(0, 1fr))' 
                   : 'repeat(4, minmax(0, 1fr))'
               }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const stepColor = getStepColor(step, index);
              const active = isStepActive(index);
              const current = isStepCurrent(index);

              const colorClasses = {
                blue: 'bg-blue-500 text-white',
                orange: 'bg-orange-500 text-white',
                purple: 'bg-purple-500 text-white',
                green: 'bg-green-500 text-white',
                gray: 'bg-gray-300 text-gray-500'
              };

              const ringClasses = {
                blue: 'ring-blue-200',
                orange: 'ring-orange-200',
                purple: 'ring-purple-200',
                green: 'ring-green-200',
                gray: 'ring-gray-200'
              };

              return (
                <div key={index} className="flex flex-col items-center relative" style={{ zIndex: 2 }}>
                  {/* Ícono circular */}
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
                    active ? colorClasses[stepColor] : colorClasses.gray,
                    current && "ring-4 animate-pulse",
                    current && ringClasses[stepColor],
                    current && "scale-110"
                  )}>
                    <Icon className={cn(
                      "h-10 w-10 transition-transform duration-300",
                      current && "animate-bounce"
                    )} />
                  </div>

                  {/* Label */}
                  <div className="mt-4 text-center">
                    <p className={cn(
                      "font-bold text-sm transition-colors duration-300",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">
                      {step.description}
                    </p>
                  </div>

                  {/* Checkmark para pasos completados */}
                  {active && !current && index < currentStep && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
