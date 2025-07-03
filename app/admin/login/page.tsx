import SecurityNotFound from '@/app/components/SecurityNotFound'

export default function LegacyAdminLogin() {
  return <SecurityNotFound reason="legacy_path" pathname="/admin/login" />
}

