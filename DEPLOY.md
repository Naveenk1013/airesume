# 🚀 Deploying to Vercel

This guide helps you deploy the Resume Builder to Vercel for free.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free)
- A [GitHub account](https://github.com) (optional but recommended)
- Your [OpenRouter API key](https://openrouter.ai/)

## Option 1: Deploy via Vercel Dashboard (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Add environment variable:
   - Name: `VITE_OPENROUTER_API_KEY`
   - Value: Your OpenRouter API key
5. Click **Deploy**

Your app will be live at `https://your-project.vercel.app`

## Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# For production deployment
vercel --prod
```

## Environment Variables

In the Vercel dashboard, go to **Settings → Environment Variables** and add:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENROUTER_API_KEY` | Yes | Your OpenRouter API key for AI features |

## Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Automatic Deployments

Once connected to GitHub:

- **Main branch** → Production deployment
- **Other branches** → Preview deployments

## Troubleshooting

### Build fails

- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors: `npm run build`

### AI features not working

- Verify `VITE_OPENROUTER_API_KEY` is set in Vercel dashboard
- Check that the API key is valid

---

Made with ❤️ for accessible education
