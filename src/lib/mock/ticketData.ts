// ─── Ticket Mock Data ────────────────────────────────────────────────────────
// Mock data for the admin ticket management system

import type { BadgeStatus } from '@/components/ui/Badge';

// ─── Types ──────────────────────────────────────────────────────────────────

export type TicketCategory =
  | 'document_issue'
  | 'technical'
  | 'service_complaint'
  | 'info_request'
  | 'bug_report';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TicketResponse {
  id: string;
  author: string;
  authorRole: 'citizen' | 'admin';
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  citizenName: string;
  citizenId: string;
  citizenEmail: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function hoursAgo(n: number): string {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

function minutesAgo(n: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - n);
  return d.toISOString();
}

// ─── Mock Tickets ───────────────────────────────────────────────────────────

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'No puedo descargar mi cédula digital',
    description: 'Desde hace 3 días intento descargar mi cédula digital pero el botón no responde. Ya intenté desde Chrome y Safari. Mi conexión a internet funciona bien para todo lo demás.',
    category: 'technical',
    priority: 'high',
    status: 'open',
    citizenName: 'Carlos García Martínez',
    citizenId: 'cit-001',
    citizenEmail: 'carlos.garcia@email.co',
    assignedTo: null,
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(3),
    responses: [],
  },
  {
    id: 'TKT-002',
    subject: 'Error en la fecha de nacimiento de mi documento',
    description: 'Mi cédula digital muestra la fecha de nacimiento incorrecta. Dice 15/03/1990 pero la correcta es 15/03/1989. Necesito corregirlo urgentemente porque tengo una cita en la Registraduría.',
    category: 'document_issue',
    priority: 'urgent',
    status: 'in_progress',
    citizenName: 'María López Rodríguez',
    citizenId: 'cit-002',
    citizenEmail: 'maria.lopez@email.co',
    assignedTo: 'Patricia Romero Luna',
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(5),
    responses: [
      {
        id: 'resp-001',
        author: 'Patricia Romero Luna',
        authorRole: 'admin',
        content: 'Buenos días, María. Estamos revisando tu caso. Necesitamos que adjuntes una foto de tu cédula física para comparar los datos. ¿Puedes enviarla por favor?',
        createdAt: hoursAgo(8),
      },
      {
        id: 'resp-002',
        author: 'María López Rodríguez',
        authorRole: 'citizen',
        content: 'Ya adjunté la foto de mi cédula física. Como pueden ver, la fecha correcta es 1989, no 1990.',
        createdAt: hoursAgo(5),
      },
    ],
  },
  {
    id: 'TKT-003',
    subject: 'Solicitud de información sobre renovación de pasaporte',
    description: 'Quisiera saber cuáles son los pasos para renovar mi pasaporte a través de la plataforma digital. ¿Es posible hacerlo completamente en línea?',
    category: 'info_request',
    priority: 'low',
    status: 'resolved',
    citizenName: 'Ana Ramírez Torres',
    citizenId: 'cit-004',
    citizenEmail: 'ana.ramirez@email.co',
    assignedTo: 'Luisa Fernanda Peña',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(3),
    responses: [
      {
        id: 'resp-003',
        author: 'Luisa Fernanda Peña',
        authorRole: 'admin',
        content: 'Hola Ana, sí es posible iniciar el trámite en línea. Debes ir a la sección de Documentos, seleccionar "Pasaporte" y seguir los pasos. Luego deberás presentarte en la oficina de la Cancillería más cercana para la toma de foto y huellas.',
        createdAt: daysAgo(4),
      },
      {
        id: 'resp-004',
        author: 'Ana Ramírez Torres',
        authorRole: 'citizen',
        content: 'Perfecto, muchas gracias por la información. Ya inicié el proceso.',
        createdAt: daysAgo(3),
      },
    ],
  },
  {
    id: 'TKT-004',
    subject: 'La aplicación se cierra sola al abrir documentos',
    description: 'Cada vez que intento abrir la sección de documentos, la aplicación se cierra automáticamente. Estoy usando un Samsung Galaxy A52 con Android 14.',
    category: 'bug_report',
    priority: 'high',
    status: 'in_progress',
    citizenName: 'Diego Moreno Sánchez',
    citizenId: 'cit-005',
    citizenEmail: 'diego.moreno@email.co',
    assignedTo: 'Javier Gómez Rincón',
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(12),
    responses: [
      {
        id: 'resp-005',
        author: 'Javier Gómez Rincón',
        authorRole: 'admin',
        content: 'Hola Diego, hemos identificado un problema con dispositivos Samsung que tienen Android 14. Estamos trabajando en una actualización. Por ahora, puedes intentar limpiar la caché de la app desde Configuración > Aplicaciones.',
        createdAt: hoursAgo(12),
      },
    ],
  },
  {
    id: 'TKT-005',
    subject: 'Queja por demora en verificación de identidad',
    description: 'Llevo más de 2 semanas esperando la verificación de mi identidad. El sistema dice "en proceso" pero nadie me ha contactado. Necesito mis documentos digitales para un trámite laboral urgente.',
    category: 'service_complaint',
    priority: 'urgent',
    status: 'open',
    citizenName: 'Valentina Castro Díaz',
    citizenId: 'cit-006',
    citizenEmail: 'valentina.castro@email.co',
    assignedTo: null,
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(6),
    responses: [],
  },
  {
    id: 'TKT-006',
    subject: 'No aparece mi licencia de conducción',
    description: 'Renové mi licencia de conducción hace un mes pero no aparece en la plataforma digital. La secretaría de tránsito me confirmó que ya fue expedida.',
    category: 'document_issue',
    priority: 'medium',
    status: 'in_progress',
    citizenName: 'Andrés Vargas Ruiz',
    citizenId: 'cit-007',
    citizenEmail: 'andres.vargas@email.co',
    assignedTo: 'Miguel Ángel Torres',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    responses: [
      {
        id: 'resp-006',
        author: 'Miguel Ángel Torres',
        authorRole: 'admin',
        content: 'Hola Andrés, estamos sincronizando los datos con la Secretaría de Tránsito. Tu licencia debería aparecer en un plazo máximo de 48 horas.',
        createdAt: daysAgo(1),
      },
    ],
  },
  {
    id: 'TKT-007',
    subject: '¿Cómo actualizo mi dirección de residencia?',
    description: 'Me mudé de Bogotá a Medellín y necesito actualizar mi dirección en todos mis documentos digitales. ¿Cómo puedo hacerlo?',
    category: 'info_request',
    priority: 'low',
    status: 'closed',
    citizenName: 'Camila Jiménez Ortiz',
    citizenId: 'cit-008',
    citizenEmail: 'camila.jimenez@email.co',
    assignedTo: 'Luisa Fernanda Peña',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(8),
    responses: [
      {
        id: 'resp-007',
        author: 'Luisa Fernanda Peña',
        authorRole: 'admin',
        content: 'Hola Camila, puedes actualizar tu dirección desde tu perfil en la sección "Información Personal". Los cambios se reflejarán en todos tus documentos automáticamente.',
        createdAt: daysAgo(9),
      },
      {
        id: 'resp-008',
        author: 'Camila Jiménez Ortiz',
        authorRole: 'citizen',
        content: 'Ya lo hice, todo actualizado. Gracias.',
        createdAt: daysAgo(8),
      },
    ],
  },
  {
    id: 'TKT-008',
    subject: 'Error 500 al intentar verificación biométrica',
    description: 'Al intentar la verificación biométrica por huella dactilar, recibo un error 500 del servidor. He intentado varias veces en diferentes horarios.',
    category: 'bug_report',
    priority: 'high',
    status: 'resolved',
    citizenName: 'Sebastián Ríos Valencia',
    citizenId: 'cit-011',
    citizenEmail: 'sebastian.rios@email.co',
    assignedTo: 'Javier Gómez Rincón',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(4),
    responses: [
      {
        id: 'resp-009',
        author: 'Javier Gómez Rincón',
        authorRole: 'admin',
        content: 'Hola Sebastián, identificamos un problema temporal con el servicio de verificación biométrica. Ya fue solucionado. ¿Podrías intentar nuevamente?',
        createdAt: daysAgo(5),
      },
      {
        id: 'resp-010',
        author: 'Sebastián Ríos Valencia',
        authorRole: 'citizen',
        content: 'Funcionó perfectamente. Muchas gracias por la rápida solución.',
        createdAt: daysAgo(4),
      },
    ],
  },
  {
    id: 'TKT-009',
    subject: 'Pago duplicado en trámite de pasaporte',
    description: 'El sistema me cobró dos veces el trámite del pasaporte. Tengo los dos comprobantes de pago. Solicito el reembolso de uno de los pagos.',
    category: 'service_complaint',
    priority: 'urgent',
    status: 'in_progress',
    citizenName: 'Isabella Pineda Arango',
    citizenId: 'cit-012',
    citizenEmail: 'isabella.pineda@email.co',
    assignedTo: 'Carolina Medina Álvarez',
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(2),
    responses: [
      {
        id: 'resp-011',
        author: 'Carolina Medina Álvarez',
        authorRole: 'admin',
        content: 'Hola Isabella, confirmamos que efectivamente hubo un cobro duplicado. Hemos iniciado el proceso de reembolso. El dinero debería aparecer en tu cuenta en 5-7 días hábiles.',
        createdAt: hoursAgo(2),
      },
    ],
  },
  {
    id: 'TKT-010',
    subject: 'Documento de salud muestra EPS incorrecta',
    description: 'Mi carné de salud digital muestra que estoy afiliado a Nueva EPS, pero desde hace 6 meses me cambié a EPS Sura. Necesito que se actualice.',
    category: 'document_issue',
    priority: 'medium',
    status: 'open',
    citizenName: 'Daniel Ospina Castaño',
    citizenId: 'cit-013',
    citizenEmail: 'daniel.ospina@email.co',
    assignedTo: null,
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(8),
    responses: [],
  },
  {
    id: 'TKT-011',
    subject: 'No puedo iniciar sesión - cuenta bloqueada',
    description: 'Mi cuenta fue bloqueada después de varios intentos de inicio de sesión fallidos. Olvidé mi contraseña y el sistema de recuperación no me envía el correo.',
    category: 'technical',
    priority: 'high',
    status: 'resolved',
    citizenName: 'Gabriela Duarte Mendieta',
    citizenId: 'cit-014',
    citizenEmail: 'gabriela.duarte@email.co',
    assignedTo: 'Patricia Romero Luna',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(3),
    responses: [
      {
        id: 'resp-012',
        author: 'Patricia Romero Luna',
        authorRole: 'admin',
        content: 'Hola Gabriela, tu cuenta ha sido desbloqueada y hemos enviado un enlace de restablecimiento de contraseña a tu correo electrónico. Si no lo recibes en los próximos 10 minutos, revisa tu carpeta de spam.',
        createdAt: daysAgo(3),
      },
    ],
  },
  {
    id: 'TKT-012',
    subject: 'Solicitud de certificado de antecedentes',
    description: '¿Es posible obtener el certificado de antecedentes penales y disciplinarios a través de esta plataforma? Lo necesito para un proceso de contratación.',
    category: 'info_request',
    priority: 'low',
    status: 'closed',
    citizenName: 'Mateo Salazar Bernal',
    citizenId: 'cit-015',
    citizenEmail: 'mateo.salazar@email.co',
    assignedTo: 'Luisa Fernanda Peña',
    createdAt: daysAgo(14),
    updatedAt: daysAgo(12),
    responses: [
      {
        id: 'resp-013',
        author: 'Luisa Fernanda Peña',
        authorRole: 'admin',
        content: 'Hola Mateo, actualmente los certificados de antecedentes se generan desde la página de la Policía Nacional y la Procuraduría. Estamos trabajando para integrar estos servicios en la plataforma próximamente.',
        createdAt: daysAgo(13),
      },
      {
        id: 'resp-014',
        author: 'Mateo Salazar Bernal',
        authorRole: 'citizen',
        content: 'Entendido, gracias por la información.',
        createdAt: daysAgo(12),
      },
    ],
  },
  {
    id: 'TKT-013',
    subject: 'La notificación de renovación no se puede cerrar',
    description: 'Tengo una notificación persistente que me dice que renueve mi cédula, pero ya la renové hace 2 meses. No puedo cerrar ni descartar la notificación.',
    category: 'bug_report',
    priority: 'medium',
    status: 'open',
    citizenName: 'Sofía Acevedo Parra',
    citizenId: 'cit-016',
    citizenEmail: 'sofia.acevedo@email.co',
    assignedTo: null,
    createdAt: hoursAgo(1),
    updatedAt: hoursAgo(1),
    responses: [],
  },
  {
    id: 'TKT-014',
    subject: 'Queja: tiempo de espera excesivo en soporte telefónico',
    description: 'Intenté comunicarme por la línea telefónica de soporte y estuve en espera por más de 45 minutos sin que nadie me atendiera. El servicio al ciudadano debe mejorar.',
    category: 'service_complaint',
    priority: 'medium',
    status: 'closed',
    citizenName: 'Alejandro Prieto Gómez',
    citizenId: 'cit-019',
    citizenEmail: 'alejandro.prieto@email.co',
    assignedTo: 'Patricia Romero Luna',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(6),
    responses: [
      {
        id: 'resp-015',
        author: 'Patricia Romero Luna',
        authorRole: 'admin',
        content: 'Estimado Alejandro, lamentamos mucho la experiencia. Estamos ampliando nuestro equipo de soporte telefónico para reducir los tiempos de espera. Le recomendamos también utilizar nuestro chat en línea que tiene tiempos de respuesta menores.',
        createdAt: daysAgo(7),
      },
      {
        id: 'resp-016',
        author: 'Alejandro Prieto Gómez',
        authorRole: 'citizen',
        content: 'Agradezco la respuesta. Espero que mejoren el servicio.',
        createdAt: daysAgo(6),
      },
    ],
  },
  {
    id: 'TKT-015',
    subject: 'Fotos del documento se ven borrosas',
    description: 'Las fotos de mi cédula digital se ven muy borrosas cuando trato de hacer zoom. Necesito que se vean claras porque a veces me piden mostrarla como identificación.',
    category: 'technical',
    priority: 'low',
    status: 'open',
    citizenName: 'Felipe Toro Echeverri',
    citizenId: 'cit-021',
    citizenEmail: 'felipe.toro@email.co',
    assignedTo: null,
    createdAt: minutesAgo(45),
    updatedAt: minutesAgo(45),
    responses: [],
  },
];

// ─── Stats ──────────────────────────────────────────────────────────────────

export const mockTicketStats = {
  open: mockTickets.filter((t) => t.status === 'open').length,
  inProgress: mockTickets.filter((t) => t.status === 'in_progress').length,
  resolved: mockTickets.filter((t) => t.status === 'resolved').length,
  closed: mockTickets.filter((t) => t.status === 'closed').length,
  highPriority: mockTickets.filter((t) => t.priority === 'high' || t.priority === 'urgent').length,
};

// ─── Label & Badge helpers ──────────────────────────────────────────────────

export function getTicketCategoryLabel(cat: TicketCategory): string {
  const labels: Record<TicketCategory, string> = {
    document_issue: 'Problema de Documento',
    technical: 'Soporte Técnico',
    service_complaint: 'Queja de Servicio',
    info_request: 'Solicitud de Información',
    bug_report: 'Reporte de Error',
  };
  return labels[cat];
}

export function getTicketStatusLabel(status: TicketStatus): string {
  const labels: Record<TicketStatus, string> = {
    open: 'Abierto',
    in_progress: 'En Progreso',
    resolved: 'Resuelto',
    closed: 'Cerrado',
  };
  return labels[status];
}

export function getTicketPriorityLabel(priority: TicketPriority): string {
  const labels: Record<TicketPriority, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  };
  return labels[priority];
}

export function getTicketStatusBadge(status: TicketStatus): BadgeStatus {
  const map: Record<TicketStatus, BadgeStatus> = {
    open: 'info',
    in_progress: 'pending',
    resolved: 'active',
    closed: 'default',
  };
  return map[status];
}

export function getTicketPriorityBadge(priority: TicketPriority): BadgeStatus {
  const map: Record<TicketPriority, BadgeStatus> = {
    low: 'default',
    medium: 'pending',
    high: 'expiring',
    urgent: 'expired',
  };
  return map[priority];
}

export function getTicketCategoryBadge(cat: TicketCategory): BadgeStatus {
  const map: Record<TicketCategory, BadgeStatus> = {
    document_issue: 'info',
    technical: 'pending',
    service_complaint: 'expired',
    info_request: 'active',
    bug_report: 'expiring',
  };
  return map[cat];
}
