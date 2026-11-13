import type { Scalars } from '@prisma/orm-postgres/family-contract/types';
import type { Models } from '../../../prisma/contract.d';

type PerfilScalars = Scalars<Models.public_Perfil>;

export class Perfil implements PerfilScalars {
    id: PerfilScalars['id'];
    nomeCompleto: PerfilScalars['nomeCompleto'];
    cargoTitulo: PerfilScalars['cargoTitulo'];
    biografia: PerfilScalars['biografia'];
    especialidades: PerfilScalars['especialidades'];
    emailContato: PerfilScalars['emailContato'];
    urlLinkedin: PerfilScalars['urlLinkedin'];
    urlGithub: PerfilScalars['urlGithub'];
    urlCvPdf: PerfilScalars['urlCvPdf'];
    createdAt: PerfilScalars['createdAt'];
    updatedAt: PerfilScalars['updatedAt'];

}

