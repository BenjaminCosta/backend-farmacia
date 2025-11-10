import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { login, register, me, clearError, selectIsAuthenticated, selectAuth } from '@/store/auth/authSlice';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const { loading, error: authError } = useAppSelector(selectAuth);
    
    const [success, setSuccess] = useState(null);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [localError, setLocalError] = useState(null);

    const from = location.state?.from?.pathname || '/';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLocalError(null);
        setSuccess(null);
        dispatch(clearError());

        try {
            // 1. Login para obtener token
            await dispatch(login({ email: loginData.email, password: loginData.password })).unwrap();
            
            // 2. Cargar datos del usuario con el token
            await dispatch(me()).unwrap();
            
            setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1000);
        } catch (err) {
            setLocalError(err || 'Email o contraseña incorrectos');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLocalError(null);
        setSuccess(null);
        dispatch(clearError());

        if (registerData.password !== registerData.confirmPassword) {
            setLocalError('Las contraseñas no coinciden');
            return;
        }

        if (registerData.password.length < 6) {
            setLocalError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            // 1. Register para crear usuario y obtener token
            await dispatch(register({ 
                email: registerData.email, 
                password: registerData.password, 
                name: registerData.name 
            })).unwrap();
            
            // 2. Cargar datos del usuario con el token
            await dispatch(me()).unwrap();
            
            setSuccess('¡Registro exitoso! Redirigiendo...');
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1000);
        } catch (err) {
            setLocalError(err || 'Error al registrarse. Intenta nuevamente.');
        }
    };

    const displayError = localError || authError;
    return (<div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">FR</span>
          </div>
          <CardTitle className="text-2xl">Farmacia Russo</CardTitle>
          <CardDescription>Ingresá a tu cuenta o creá una nueva</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mensajes de error y éxito */}
          {displayError && (<Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4"/>
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>)}
          
          {success && (<Alert className="mb-4 border-green-500 text-green-700 bg-green-50">
              <CheckCircle2 className="h-4 w-4"/>
              <AlertDescription>{success}</AlertDescription>
            </Alert>)}

          <Tabs defaultValue="login" onValueChange={() => { 
            setLocalError(null); 
            setSuccess(null); 
            dispatch(clearError());
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Ingresar</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="tu@email.com" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required disabled={loading}/>
                </div>
                <div>
                  <Label htmlFor="login-password">Contraseña</Label>
                  <div className="relative">
                    <Input id="login-password" type={showLoginPassword ? 'text' : 'password'} placeholder="••••••••" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required disabled={loading} className="pr-10"/>
                    <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
                      {showLoginPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Nombre Completo</Label>
                  <Input id="register-name" type="text" placeholder="Juan Pérez" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required disabled={loading}/>
                </div>
                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" placeholder="tu@email.com" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required disabled={loading}/>
                </div>
                <div>
                  <Label htmlFor="register-password">Contraseña</Label>
                  <div className="relative">
                    <Input id="register-password" type={showRegisterPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required disabled={loading} className="pr-10"/>
                    <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
                      {showRegisterPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="register-confirm">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Input id="register-confirm" type={showConfirmPassword ? 'text' : 'password'} placeholder="Repite tu contraseña" value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required disabled={loading} className="pr-10"/>
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
                      {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>);
};
export default Login;
