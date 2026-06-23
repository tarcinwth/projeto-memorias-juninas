<div align="center">
  <img src="public/logo-hero.png" alt="Logo Memória do São João de Amargosa" width="300"/>

  # Memória do São João de Amargosa
  
  **O arquivo vivo de quem viveu a maior festa junina do interior da Bahia.**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Upload-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)
</div>

<br />

## 🌽 Sobre o Projeto

O **Memória do São João de Amargosa** é um arquivo cultural digital colaborativo dedicado a preservar fotos, vídeos, histórias e depoimentos de todas as edições do São João de Amargosa, uma das festas juninas mais tradicionais do Brasil. 

Qualquer pessoa pode enviar uma memória da festa. Após a revisão da moderação, o conteúdo entra para o acervo público do site, ficando preservado e acessível para toda a comunidade.

---

## ✨ Funcionalidades Principais

* 📸 **Acervo Dinâmico:** Galeria interativa com memórias enviadas pelo público (fotos e vídeos).
* 🔍 **Filtros Inteligentes:** Busque por memórias via texto, categorias (Vila Junina, Shows, Quadrilhas) ou pelos anos reais em que a festa aconteceu.
* ❤️ **Curtidas (Likes) em Tempo Real:** Sistema de interações persistentes no Firebase (requer login).
* 📤 **Upload de Mídia:** Envio seguro e otimizado de imagens e vídeos de até 50MB, integrando com Cloudinary.
* 📲 **Web Share API:** Compartilhamento nativo de memórias no WhatsApp e Redes Sociais através de dispositivos móveis.
* 🛡️ **Painel de Moderação Seguro:** Rota administrativa blindada, acessível apenas pelo administrador autorizado do projeto.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído priorizando performance, UX e segurança usando o que há de mais moderno no ecossistema Web:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Estilização:** CSS Vanilla com variáveis e tokens de design super otimizados (Minimalismo, Contrastes Quentes e Tipografia Elegante)
* **Ícones:** [Phosphor Icons](https://phosphoricons.com/)
* **Banco de Dados & Auth:** [Firebase Firestore](https://firebase.google.com/) e Firebase Authentication (Google Login)
* **Hospedagem de Mídias:** [Cloudinary](https://cloudinary.com/) API
* **Fontes:** Playfair Display & Outfit (`next/font/google`)

---

## 🚀 Como Rodar o Projeto Localmente

### 1. Clone o repositório
```bash
git clone https://github.com/tarcinwth/projeto-memorias-juninas.git
cd projeto-memorias-juninas
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto e preencha com as credenciais do seu Firebase e Cloudinary:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset

NEXT_PUBLIC_ADMIN_EMAIL=tarciio.spotify@gmail.com
```

### 4. Inicie o Servidor de Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação rodando!

---

## 👨‍💻 Desenvolvedor & Créditos

Projeto criado com muito forró e tecnologia por **[Woota Studio](https://studiowoota.vercel.app/)**!

💌 Contato: [tarciio.spotify@gmail.com](mailto:tarciio.spotify@gmail.com)
📱 WhatsApp: [(75) 99286-7272](https://wa.me/5575992867272)

---
<div align="center">
  <i>"Guardando o forró que a chuva não apagou."</i>
</div>
