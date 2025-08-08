### Installation
Import from `@apix/ui` (adjust to your workspace alias if different).

### Button
- Props: { children: ReactNode; className?: string; appName: string }
- Behavior: Alerts "Hello from your <appName> app!" on click
- Usage:
```tsx
import { Button } from '@apix/ui';

<Button appName="Docs" className="px-3 py-2 bg-blue-600 text-white rounded">
  Click me
</Button>
```

### Card
- Props: { className?: string; title: string; children: React.ReactNode; href: string }
- Behavior: Anchor card; opens in new tab with UTM params
- Usage:
```tsx
import { Card } from '@apix/ui';

<Card title="API Docs" href="/api-docs" className="block p-4 border rounded">
  Explore the API reference
</Card>
```

### Code
- Props: { children: React.ReactNode; className?: string }
- Usage:
```tsx
import { Code } from '@apix/ui';

<p>Command: <Code className="px-1 bg-gray-800">npm run dev</Code></p>
```