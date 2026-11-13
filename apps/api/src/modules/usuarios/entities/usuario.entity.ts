import type { Scalars } from '@prisma/orm-postgres/family-contract/types';
import type { Models } from '../../../prisma/contract.d';

type UsuarioScalars = Scalars<Models.public_Usuario>;

export class Usuario implements UsuarioScalars {
  id!: UsuarioScalars['id'];
  email!: UsuarioScalars['email'];
  senhaHash!: UsuarioScalars['senhaHash'];
  papel!: UsuarioScalars['papel'];
  perfilId!: UsuarioScalars['perfilId'];
  createdAt!: UsuarioScalars['createdAt'];
  updatedAt!: UsuarioScalars['updatedAt'];
}