import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/auth/authSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit, Trash2, Users, Shield, Package, UserCog, ShoppingCart, TrendingUp } from "lucide-react";
import Loader from "@/components/Loader";
import { formatPrice } from "@/lib/formatPrice";
import { useGetUsersQuery, useGetRolesQuery, useCreateUserMutation, useUpdateUserRoleMutation, useDeleteUserMutation } from "@/services/admin";
import { useGetAllOrdersQuery } from "@/services/orders";

const AdminPanel = () => {
    const currentUser = useAppSelector(selectUser);
    
    const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
    const { data: roles = [], isLoading: rolesLoading } = useGetRolesQuery();
    const { data: orders = [], isLoading: ordersLoading } = useGetAllOrdersQuery();
    
    const [createUser] = useCreateUserMutation();
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [deleteUser] = useDeleteUserMutation();
    
    const loading = usersLoading || rolesLoading || ordersLoading;
    
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    // Form states
    const [newUser, setNewUser] = useState({
        email: "",
        name: "",
        password: "",
        roleId: "",
    });
    const handleCreateUser = async () => {
        if (!newUser.email || !newUser.name || !newUser.password || !newUser.roleId) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        try {
            await createUser({
                ...newUser,
                roleId: parseInt(newUser.roleId),
            }).unwrap();
            toast.success("Usuario creado exitosamente");
            setCreateModalOpen(false);
            setNewUser({ email: "", name: "", password: "", roleId: "" });
        }
        catch (error) {
            const message = error.data?.message || "Error al crear usuario";
            toast.error(message);
        }
    };
    const handleUpdateRole = async () => {
        if (!selectedUser || !newUser.roleId) {
            toast.error("Debe seleccionar un rol");
            return;
        }
        try {
            await updateUserRole({
                id: selectedUser.id,
                roleId: parseInt(newUser.roleId),
            }).unwrap();
            toast.success("Rol actualizado exitosamente");
            setEditModalOpen(false);
            setSelectedUser(null);
            setNewUser({ email: "", name: "", password: "", roleId: "" });
        }
        catch (error) {
            const message = error.data?.message || "Error al actualizar rol";
            toast.error(message);
        }
    };
    const handleDeleteUser = async () => {
        if (!selectedUser)
            return;
        try {
            await deleteUser(selectedUser.id).unwrap();
            toast.success("Usuario eliminado exitosamente");
            setDeleteConfirmOpen(false);
            setSelectedUser(null);
        }
        catch (error) {
            const message = error.data?.message || "Error al eliminar usuario";
            toast.error(message);
        }
    };
    const openEditModal = (user) => {
        setSelectedUser(user);
        setNewUser({ ...newUser, roleId: user.role.id.toString() });
        setEditModalOpen(true);
    };
    const openDeleteConfirm = (user) => {
        setSelectedUser(user);
        setDeleteConfirmOpen(true);
    };
    if (loading) {
        return <Loader />;
    }
    const getRoleBadgeColor = (roleName) => {
        switch (roleName) {
            case "ADMIN":
                return "bg-red-100 text-red-800";
            case "PHARMACIST":
                return "bg-blue-100 text-blue-800";
            case "USER":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "CONFIRMED":
                return "bg-blue-100 text-blue-800";
            case "DELIVERED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    return (<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Mejorado */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-2xl blur-3xl -z-10" />
          <div className="bg-white/80 backdrop-blur-sm border-2 border-red-500/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                    Panel de Administración
                  </h1>
                  <p className="text-muted-foreground mt-1 font-medium">
                    🔐 Gestiona usuarios, roles y visualiza todas las órdenes del sistema
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Admin actual</p>
                  <p className="text-sm font-semibold">{currentUser?.name || currentUser?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900">Total Usuarios</CardTitle>
              <div className="p-2 bg-blue-600 rounded-xl shadow-md">
                <Users className="h-5 w-5 text-white"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{users.length}</div>
              <p className="text-xs text-blue-700 font-medium mt-1">En el sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-900">Roles Activos</CardTitle>
              <div className="p-2 bg-purple-600 rounded-xl shadow-md">
                <Shield className="h-5 w-5 text-white"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{roles.length}</div>
              <p className="text-xs text-purple-700 font-medium mt-1">Tipos de usuario</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-900">Total Órdenes</CardTitle>
              <div className="p-2 bg-green-600 rounded-xl shadow-md">
                <ShoppingCart className="h-5 w-5 text-white"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{orders.length}</div>
              <p className="text-xs text-green-700 font-medium mt-1">En el sistema</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full space-y-4">
          <TabsList className="bg-gradient-to-r from-red-500/10 to-purple-500/10 border-2 border-red-500/20 p-1">
            <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Users className="mr-2 h-4 w-4"/>
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Shield className="mr-2 h-4 w-4"/>
              Roles
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Package className="mr-2 h-4 w-4"/>
              Todas las Órdenes
            </TabsTrigger>
          </TabsList>

        {/* TAB: USUARIOS */}
        <TabsContent value="users">
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                    <UserCog className="h-6 w-6" />
                    Gestión de Usuarios
                  </CardTitle>
                  <CardDescription className="text-blue-700 font-medium">
                    Crear, editar y eliminar usuarios del sistema
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
                >
                  <UserPlus className="mr-2 h-4 w-4"/>
                  Crear Usuario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (<TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role.name)}>
                          {user.role.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditModal(user)}
                            className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4"/>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openDeleteConfirm(user)}
                            className="hover:bg-red-100 hover:text-red-600 transition-colors"
                            disabled={user.id === currentUser?.id}
                          >
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: ROLES */}
        <TabsContent value="roles">
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b-2 border-purple-200">
              <CardTitle className="text-2xl font-bold text-purple-900 flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Roles del Sistema
              </CardTitle>
              <CardDescription className="text-purple-700 font-medium">
                Visualiza todos los roles disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {roles.map((role) => (
                  <Card key={role.id} className="border-2 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className={`${
                      role.name === 'ADMIN' ? 'bg-red-50 border-b-2 border-red-200' :
                      role.name === 'PHARMACIST' ? 'bg-blue-50 border-b-2 border-blue-200' :
                      'bg-green-50 border-b-2 border-green-200'
                    }`}>
                      <CardTitle className={`text-lg flex items-center gap-2 ${
                        role.name === 'ADMIN' ? 'text-red-900' :
                        role.name === 'PHARMACIST' ? 'text-blue-900' :
                        'text-green-900'
                      }`}>
                        {role.name === 'ADMIN' && <Shield className="h-5 w-5" />}
                        {role.name === 'PHARMACIST' && <UserCog className="h-5 w-5" />}
                        {role.name === 'USER' && <Users className="h-5 w-5" />}
                        {role.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: TODAS LAS ÓRDENES */}
        <TabsContent value="orders">
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
              <CardTitle className="text-2xl font-bold text-green-900 flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Todas las Órdenes
              </CardTitle>
              <CardDescription className="text-green-700 font-medium">
                Vista completa de todas las órdenes en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2">
                    <TableHead className="font-bold">ID</TableHead>
                    <TableHead className="font-bold">Cliente</TableHead>
                    <TableHead className="font-bold">Total</TableHead>
                    <TableHead className="font-bold">Estado</TableHead>
                    <TableHead className="font-bold">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.fullName}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusBadgeColor(order.status)} font-semibold`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL: CREAR USUARIO */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Complete los datos del nuevo usuario
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="usuario@ejemplo.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" placeholder="Juan Pérez" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={newUser.roleId} onValueChange={(value) => setNewUser({ ...newUser, roleId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol"/>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (<SelectItem key={role.id} value={role.id.toString()}>
                      {role.name} - {role.description}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser}>Crear Usuario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: EDITAR ROL */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
            <DialogDescription>
              Usuario: {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editRole">Nuevo Rol</Label>
              <Select value={newUser.roleId} onValueChange={(value) => setNewUser({ ...newUser, roleId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol"/>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (<SelectItem key={role.id} value={role.id.toString()}>
                      {role.name} - {role.description}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRole}>Actualizar Rol</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: CONFIRMAR ELIMINACIÓN */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser?.email}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Eliminar Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default AdminPanel;
