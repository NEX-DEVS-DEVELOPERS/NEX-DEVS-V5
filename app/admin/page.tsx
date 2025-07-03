import SecurityNotFound from '@/app/components/SecurityNotFound'

export default function LegacyAdminPage() {
  return <SecurityNotFound reason="legacy_path" pathname="/admin" />
}

