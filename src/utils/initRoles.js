// src/utils/initRoles.js
export const initRoles = async (db) => {
  const Rol = db.rol;

  const defaultRoles = [
    { name: "admin", description: "Administrador del sistema" },
    { name: "moderator", description: "Moderador con permisos limitados" },
    { name: "user", description: "Usuario estándar del sistema" },
  ];

  for (const roleData of defaultRoles) {
    const existing = await Rol.findOne({ where: { name: roleData.name } });
    if (!existing) {
      await Rol.create(roleData);
      console.log(`✅ Rol creado: ${roleData.name}`);
    }
  }

  console.log("✅ Verificación de roles completada");
};
