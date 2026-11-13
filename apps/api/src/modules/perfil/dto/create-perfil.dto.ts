// dto/create-perfil.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import type { Perfil } from '../entities/perfil.entity';

// Links do LinkedIn e do GitHub só aceitam URL https completa.
const HTTPS_URL = { protocols: ['https'], require_protocol: true };

export class CreatePerfilDto
  implements
    Pick<
      Perfil,
      | 'nomeCompleto'
      | 'cargoTitulo'
      | 'biografia'
      | 'especialidades'
      | 'emailContato'
      | 'urlLinkedin'
      | 'urlGithub'
    >
{
  // Nome do profissional (nome_completo).
  @IsString()
  @IsNotEmpty()
  nomeCompleto: string;

  // Título principal, ex.: "Desenvolvedor Full Stack Web" (cargo_titulo).
  @IsString()
  @IsNotEmpty()
  cargoTitulo: string;

  // Resumo da trajetória e do foco profissional.
  @IsString()
  @IsNotEmpty()
  biografia: string;

  // Principais especialidades, exibidas no resumo profissional.
  @IsString()
  @IsNotEmpty()
  especialidades: string;

  // E-mail profissional de contato (email_contato).
  @IsEmail()
  emailContato: string;

  // Perfil no LinkedIn (url_linkedin).
  @IsUrl(HTTPS_URL)
  urlLinkedin: string;

  // Perfil no GitHub (url_github).
  @IsUrl(HTTPS_URL)
  urlGithub: string;
}