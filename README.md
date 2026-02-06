# PROJETO PRÁTICO - IMPLEMENTAÇÃO FULL STACK SÊNIOR
## Catálogo de Músicas - Java + React (Next.js)

---

| **Campo**        | **Valor**                        |
|------------------|----------------------------------|
| **VAGA**         | Desenvolvedor Full Stack Sênior  |
| **NOME**         | RONIERE S. DE CARVALHO           |
| **CPF**          | 052.\*\*\*.\*\*\*-14             |
| **Nº INSCRIÇÃO** | 16502                            |
-------------------------------------------------------

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Estrutura de Diretórios](#estrutura-de-diretórios)
4. [Tecnologias](#tecnologias)
5. [Pré-requisitos](#pré-requisitos)
6. [Como Executar](#como-executar)
7. [Como Testar](#como-testar)
8. [Autenticação](#autenticação)
9. [Funcionalidades Implementadas](#funcionalidades-implementadas)
10. [API Endpoints](#api-endpoints)

---

## 🎯 Visão Geral

Sistema de gerenciamento de catálogo de músicas com funcionalidades de CRUD para **Álbuns** e **Artistas**. A aplicação segue os princípios de **Clean Architecture** e **Clean Code**, utilizando autenticação via **Keycloak**, armazenamento de imagens no **MinIO** e cache com **Redis**.

---

## 🏗️ Arquitetura

### Clean Architecture

O projeto segue os princípios da **Clean Architecture** de Uncle Bob, organizando o código em camadas bem definidas:

```
┌─────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE                            │
│  (Controllers, Adapters, Config, Persistence, Storage)           │
├─────────────────────────────────────────────────────────────────┤
│                         APPLICATION                              │
│  (Use Cases, DTOs, Mappers, Ports, Exceptions)                   │
├─────────────────────────────────────────────────────────────────┤
│                           DOMAIN                                 │
│  (Entities, Business Rules, Models)                              │
└─────────────────────────────────────────────────────────────────┘
```

### Diagrama de Arquitetura do Sistema

```
                    ┌──────────────┐
                    │    NGINX     │
                    │  (Reverse    │
                    │   Proxy)     │
                    │  :80 / :443  │
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               │
    ┌──────────┐    ┌──────────┐           │
    │ FRONTEND │    │ BACKEND  │           │
    │ Next.js  │◄──►│ Spring   │           │
    │  :3000   │    │  :8080   │           │
    └──────────┘    └────┬─────┘           │
                         │                 │
         ┌───────────────┼───────────────┐ │
         │               │               │ │
         ▼               ▼               ▼ ▼
  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │ PostgreSQL │  │   MinIO    │  │  Keycloak  │
  │   :5432    │  │ :9000/9001 │  │   :8081    │
  └────────────┘  └────────────┘  └────────────┘
         │
         ▼
  ┌────────────┐
  │   Redis    │
  │   :6379    │
  └────────────┘
```

---

## 📁 Estrutura de Diretórios

```
ronieresilvadecarvalho052221/
├── 📁 backend/                          # API Spring Boot
│   ├── 📁 src/main/java/com/group/music_catalog_manage/
│   │   ├── 📁 application/              # Camada de Aplicação
│   │   │   ├── 📁 controller/           # Controllers REST
│   │   │   ├── 📁 dto/                  # Data Transfer Objects
│   │   │   ├── 📁 exceptions/           # Exceções customizadas
│   │   │   ├── 📁 mapper/               # Mapeadores (Entity ↔ DTO)
│   │   │   ├── 📁 ports/                # Interfaces (Portas)
│   │   │   └── 📁 usecases/             # Casos de Uso
│   │   ├── 📁 domain/                   # Camada de Domínio
│   │   │   └── 📁 model/                # Entidades de Domínio
│   │   └── 📁 infrastructure/           # Camada de Infraestrutura
│   │       ├── 📁 adapters/             # Adaptadores (Keycloak, etc)
│   │       ├── 📁 api/                  # Clientes API externos
│   │       ├── 📁 config/               # Configurações (Security, etc)
│   │       ├── 📁 persistence/          # JPA Repositories
│   │       ├── 📁 service/              # Serviços de infraestrutura
│   │       ├── 📁 storage/              # MinIO Storage
│   │       └── 📁 web/                  # WebSocket, REST configs
│   ├── 📁 src/test/                     # Testes unitários
│   └── 📄 Dockerfile                    # Docker config
│
├── 📁 frontend/                         # Next.js + React
│   ├── 📁 src/
│   │   ├── 📁 app/                      # Páginas (App Router)
│   │   │   ├── 📁 albums/               # Página de Álbuns
│   │   │   ├── 📁 artists/              # Página de Artistas
│   │   │   └── 📁 login/                # Página de Login
│   │   ├── 📁 components/               # Componentes React
│   │   │   ├── 📁 modals/               # Modais (Create/Edit)
│   │   │   └── 📁 ui/                   # Componentes UI (shadcn)
│   │   ├── 📁 core/                     # Utilitários e tipos
│   │   ├── 📁 hooks/                    # React Hooks customizados
│   │   ├── 📁 services/                 # Serviços API (Facade Pattern)
│   │   ├── 📁 state/                    # Gerenciamento de Estado
│   │   └── 📁 tests/                    # Testes unitários
│   └── 📄 Dockerfile                    # Docker config
│
├── 📁 keycloak/                         # Configuração Keycloak
│   └── 📄 realm-export.json             # Realm pré-configurado
│
├── 📁 nginx/                            # Configuração Nginx
│   └── 📄 nginx.conf                    # Reverse Proxy config
│
├── 📁 certs/                            # Certificados SSL
├── 📄 docker-compose.yml                # Orquestração Docker
├── 📄 .env.production                   # Variáveis de produção
├── 📄 .env.example                      # Exemplo de variáveis
├── 📄 Jenkinsfile                       # Pipeline CI/CD
└── 📄 README.md                         # Este arquivo
```

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Java** | 17+ | Linguagem principal |
| **Spring Boot** | 3.x | Framework backend |
| **Spring Security** | - | Autenticação e autorização |
| **Spring Data JPA** | - | Persistência de dados |
| **PostgreSQL** | 15 | Banco de dados relacional |
| **Redis** | Alpine | Cache de dados |
| **MinIO** | - | Object Storage (S3-compatible) |
| **Keycloak** | 25.0.2 | Identity Provider (OAuth2/OIDC) |

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Next.js** | 14+ | Framework React |
| **React** | 18+ | Biblioteca UI |
| **TypeScript** | - | Tipagem estática |
| **Tailwind CSS** | - | Estilização |
| **shadcn/ui** | - | Componentes UI |
| **RxJS (BehaviorSubject)** | - | Gerenciamento de estado |

### Infraestrutura
| Tecnologia | Descrição |
|------------|-----------|
| **Docker** | Containerização |
| **Docker Compose** | Orquestração de containers |
| **Nginx** | Reverse Proxy |
| **Jenkins** | CI/CD Pipeline |

---

## ⚙️ Pré-requisitos

- **Docker** >= 20.x
- **Docker Compose** >= 2.x
- **Git**

---

## 🚀 Como Executar

### Produção

```bash
# Clone o repositório
git clone <repository-url>
cd ronieresilvadecarvalho052221

# Execute em modo produção
docker-compose --env-file .env.production up -d --build
```

### Desenvolvimento

```bash
# Execute em modo desenvolvimento
docker-compose up -d --build
```

### Acessos

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Aplicação Web |
| **Backend API** | http://localhost:8080/api | API REST |
| **Swagger** | http://localhost:8080/api/swagger-ui.html | Documentação API |
| **Keycloak** | http://localhost:8081 | Admin Console |
| **MinIO Console** | http://localhost:9001 | Object Storage |

---

## 🧪 Como Testar

### Testes do Backend (Java)

```bash
cd backend
./mvnw test
```

### Testes do Frontend (Vitest)

```bash
cd frontend
npm install
npm run test
# ou
npx vitest run
```

### Testes Automatizados (Docker)

```bash
# Os testes são executados durante o build do container
docker-compose build
```

---

## 🔐 Autenticação

### Credenciais de Acesso

| Tipo | Usuário | Senha |
|------|---------|-------|
| **Aplicação** | `admin` | `admin` |
| **Keycloak Admin** | `admin` | `admin` |
| **MinIO** | `minioadmin` | `xukiliiiii` |

### Fluxo de Autenticação

1. O usuário acessa a página de login
2. As credenciais são enviadas para a API
3. A API autentica via Keycloak (OAuth2/OIDC)
4. Um token JWT é retornado
5. O token é utilizado em todas as requisições subsequentes
6. O frontend gerencia a renovação automática do token

### Configuração Keycloak

- **Realm**: `music-app`
- **Client**: `music-app-client2`
- **Grant Type**: Password (Resource Owner)

---

## ✅ Funcionalidades Implementadas

### Backend
- [x] CRUD de Álbuns com upload de capa (MinIO)
- [x] CRUD de Artistas
- [x] Autenticação JWT via Keycloak
- [x] Paginação e ordenação de resultados
- [x] Filtros de busca
- [x] Upload de imagens com presigned URLs (30min)
- [x] Cache com Redis
- [x] WebSocket para notificações em tempo real
- [x] Rate Limit (10 req/min por usuário)
- [x] Health Checks e Liveness/Readiness
- [x] Swagger/OpenAPI Documentation
- [x] Migrations (Flyway/JPA)
- [x] Testes unitários

### Frontend
- [x] Consumo da API (CRUD completo)
- [x] Autenticação integrada com backend
- [x] Interface responsiva
- [x] Componentização (Facade Pattern)
- [x] Gerenciamento de estado (BehaviorSubject)
- [x] Notificações em tempo real (WebSocket)
- [x] Timer de sessão
- [x] Testes unitários (Vitest)

### Infraestrutura
- [x] Docker Compose com todos os serviços
- [x] Nginx como reverse proxy
- [x] Containerização de frontend e backend
- [x] Jenkinsfile para CI/CD
- [x] Variáveis de ambiente por ambiente

---

## 📡 API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Renovar token |
| POST | `/api/auth/logout` | Logout |

### Álbuns
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/albums` | Listar álbuns (paginado) |
| GET | `/api/albums/{id}` | Buscar álbum por ID |
| POST | `/api/albums` | Criar álbum |
| PUT | `/api/albums/{id}` | Atualizar álbum |
| DELETE | `/api/albums/{id}` | Remover álbum |

### Artistas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/artists` | Listar artistas (paginado) |
| GET | `/api/artists/{id}` | Buscar artista por ID |
| POST | `/api/artists` | Criar artista |
| PUT | `/api/artists/{id}` | Atualizar artista |
| DELETE | `/api/artists/{id}` | Remover artista |

---

## 📝 Clean Code & Clean Architecture

### Princípios Aplicados

- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **Separation of Concerns**: Camadas bem definidas
- **Dependency Injection**: Spring IoC Container
- **Ports & Adapters**: Interfaces para desacoplamento

### Padrões de Projeto

- **Facade Pattern**: Serviços do frontend
- **Repository Pattern**: Persistência de dados
- **Use Case Pattern**: Lógica de negócios
- **DTO Pattern**: Transferência de dados
- **Mapper Pattern**: Conversão entre entidades

---

## 🔧 Variáveis de Ambiente

```env
# Database
DB_USER=postgres
DB_PASSWORD=lobcat123@@
DB_NAME=music_catalog_manage

# MinIO
MINIO_USER=minioadmin
MINIO_PASSWORD=xukiliiiii

# Redis
REDIS_PASS=admin

# Spring
SPRING_PROFILE=prod
BUILD_TARGET=runner

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
```

---

## 🔧 Troubleshooting

### Resetar Banco de Dados

Se você encontrar problemas com as migrations do Flyway ou precisar limpar o banco de dados:

```bash
# Resetar o schema do banco de dados (CUIDADO: Apaga todos os dados!)
docker-compose exec -T postgres psql -U postgres -d music_catalog_manage -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Reiniciar o backend para aplicar as migrations novamente
docker-compose restart backend
```

### Problemas Comuns

#### WebSocket não conecta
- Verifique se o backend está rodando: `docker-compose ps`
- Verifique os logs: `docker-compose logs backend`
- Certifique-se de que está autenticado na aplicação

#### Erro de Migration
- Use o comando de reset do banco acima
- Verifique se todas as migrations estão na ordem correta
- Confira os logs do backend: `docker-compose logs backend`

#### Imagens não aparecem
- Verifique se o MinIO está rodando: `docker-compose ps minio`
- Acesse o console do MinIO: http://localhost:9001
- Verifique se o bucket `music-catalog` existe

#### Erro de autenticação
- Verifique se o Keycloak está rodando: `docker-compose ps keycloack`
- Acesse o Keycloak: http://localhost:8081
- Verifique se o realm `music` existe
- Use as credenciais padrão: `admin` / `admin`

---

## 📚 Referências

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Next.js](https://nextjs.org/)
- [Keycloak](https://www.keycloak.org/)
- [MinIO](https://min.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

*Desenvolvido por Roniere S. de Carvalho - 2026*
