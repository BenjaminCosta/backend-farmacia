import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, DollarSign } from 'lucide-react';

const PaymentMethodSelector = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Método de Pago</Label>
      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        {/* Efectivo */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            value === 'cash' ? 'border-primary ring-2 ring-primary/20' : 'border-border/50'
          }`}
          onClick={() => onChange('cash')}
        >
          <CardContent className="flex items-center p-4">
            <RadioGroupItem value="cash" id="cash" className="mr-3" />
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <Label htmlFor="cash" className="font-semibold cursor-pointer">
                  Efectivo
                </Label>
                <p className="text-sm text-muted-foreground">
                  Pago al recibir el pedido
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            value === 'card' ? 'border-primary ring-2 ring-primary/20' : 'border-border/50'
          }`}
          onClick={() => onChange('card')}
        >
          <CardContent className="flex items-center p-4">
            <RadioGroupItem value="card" id="card" className="mr-3" />
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <Label htmlFor="card" className="font-semibold cursor-pointer">
                  Tarjeta de Crédito/Débito
                </Label>
                <p className="text-sm text-muted-foreground">
                  Pago seguro con Stripe
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
