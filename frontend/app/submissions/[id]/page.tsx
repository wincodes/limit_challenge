'use client';

import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Link as MuiExternalLink,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useSubmissionDetail } from '@/lib/hooks/useSubmissions';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';

function formatLabel(value: string) {
  return value.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusChipStyles(status: string) {
  switch (status) {
    case 'new':
      return { bgcolor: '#a1e4fe', color: '#005468' };
    case 'in_review':
      return { bgcolor: '#bbcffa', color: '#324669' };
    case 'closed':
      return { bgcolor: '#d5e5eb', color: '#455459' };
    case 'lost':
      return { bgcolor: '#fa746f', color: '#6e0a12' };
    default:
      return { bgcolor: 'grey.200', color: 'text.primary' };
  }
}

function getPriorityChipStyles(priority: string) {
  if (priority === 'high') {
    return { bgcolor: '#fa746f', color: '#6e0a12' };
  }
  if (priority === 'medium') {
    return { bgcolor: '#d5e5eb', color: '#455459' };
  }
  return { bgcolor: '#dee3e6', color: '#2d3335' };
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function SubmissionDetailPage() {
  const params = useParams<{ id: string }>();
  const submissionId = params?.id ?? '';

  const detailQuery = useSubmissionDetail(submissionId);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Stack spacing={4}>
          <Box>
            <MuiLink
              component={Link}
              href="/submissions"
              underline="none"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: '#1b677d',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                '&:hover .back-icon': { transform: 'translateX(-2px)' },
              }}
            >
              <ArrowBackOutlinedIcon style={{ fontSize: 16, transition: 'transform 200ms ease' }} />
              Back to list
            </MuiLink>
            <Typography sx={{ mt: 2, fontSize: { xs: 30, md: 40 }, fontWeight: 800 }}>
              Submission detail
            </Typography>
          </Box>

          {detailQuery.isLoading ? (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 4 }}>
              <CircularProgress size={20} />
              <Typography color="text.secondary">Loading submission details...</Typography>
            </Stack>
          ) : null}

          {detailQuery.isError ? (
            <Alert severity="error">Unable to load this submission right now.</Alert>
          ) : null}

          {detailQuery.data ? (
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Stack spacing={4}>
                  <Box
                    sx={{
                      bgcolor: '#ffffff',
                      p: { xs: 3, md: 4 },
                      borderRadius: 3,
                      boxShadow: '0 0 0 1px rgba(173, 179, 181, 0.15)',
                    }}
                  >
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                      spacing={2}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#1b677d',
                            mb: 1,
                          }}
                        >
                          Company Name
                        </Typography>
                        <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 900 }}>
                          {detailQuery.data.company.legalName}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                          label={formatLabel(detailQuery.data.status)}
                          size="small"
                          sx={{
                            ...getStatusChipStyles(detailQuery.data.status),
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            px: 1,
                            mb: 1,
                          }}
                        />
                        <Chip
                          label={`${formatLabel(detailQuery.data.priority)} Priority`}
                          size="small"
                          sx={{
                            ...getPriorityChipStyles(detailQuery.data.priority),
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            px: 1,
                            mb: 1,
                          }}
                        />
                      </Stack>
                    </Stack>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: 3,
                        mt: 5,
                        pt: 3,
                        borderTop: '1px solid rgba(173, 179, 181, 0.12)',
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: 'text.secondary',
                            mb: 0.5,
                          }}
                        >
                          Brokerage
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {detailQuery.data.broker.name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: 'text.secondary',
                            mb: 0.5,
                          }}
                        >
                          Submission Owner
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {detailQuery.data.owner.fullName}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: 'text.secondary',
                            mb: 0.5,
                          }}
                        >
                          Date Created
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatDate(detailQuery.data.createdAt)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: 'text.secondary',
                            mb: 0.5,
                          }}
                        >
                          Reference ID
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>{detailQuery.data.id}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ bgcolor: '#ebeef0', borderRadius: 3, p: { xs: 3, md: 4 } }}>
                    <Typography
                      sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', mb: 2 }}
                    >
                      Summary
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: 18 }}>
                      {detailQuery.data.summary || 'No summary available for this submission.'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', mb: 2 }}
                    >
                      Notes
                    </Typography>
                    <Stack spacing={2}>
                      {detailQuery.data.notes.length === 0 ? (
                        <Alert severity="info">No notes yet.</Alert>
                      ) : null}
                      {detailQuery.data.notes.map((note, index) => (
                        <Box
                          key={note.id}
                          sx={{
                            bgcolor: '#f1f4f5',
                            p: 3,
                            borderRadius: 3,
                            borderLeft: '4px solid #1b677d',
                            transition: 'background-color 200ms ease',
                            '&:hover': { bgcolor: '#e5e9eb' },
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" spacing={1} mb={2}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: index % 2 === 0 ? '#d5e5eb' : '#bbcffa',
                                  color: index % 2 === 0 ? '#455459' : '#1e3254',
                                  fontSize: 12,
                                  fontWeight: 700,
                                }}
                              >
                                {getInitials(note.authorName)}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                                  {note.authorName}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: 10,
                                    textTransform: 'uppercase',
                                    color: 'text.secondary',
                                    fontWeight: 700,
                                  }}
                                >
                                  Team note
                                </Typography>
                              </Box>
                            </Stack>
                            <Typography
                              sx={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                              }}
                            >
                              {formatDateTime(note.createdAt)}
                            </Typography>
                          </Stack>
                          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                            {note.body}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, lg: 4 }}>
                <Stack spacing={4}>
                  <Box
                    sx={{
                      bgcolor: '#ffffff',
                      p: 3,
                      borderRadius: 3,
                      boxShadow: '0 0 0 1px rgba(173, 179, 181, 0.15)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <GroupsIcon style={{ fontSize: 16 }} />
                      Contacts
                    </Typography>
                    <Stack spacing={2.5}>
                      {detailQuery.data.contacts.length === 0 ? (
                        <Alert severity="info">No contacts available.</Alert>
                      ) : null}
                      {detailQuery.data.contacts.map((contact, index) => (
                        <Box
                          key={contact.id}
                          sx={{
                            pt: index === 0 ? 0 : 2,
                            borderTop: index === 0 ? 'none' : '1px solid rgba(173, 179, 181, 0.12)',
                          }}
                        >
                          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                            {contact.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: 'text.secondary',
                              textTransform: 'uppercase',
                              mb: 1.5,
                            }}
                          >
                            {contact.role || 'Contact'}
                          </Typography>
                          <Stack spacing={0.75}>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <MailOutlinedIcon style={{ fontSize: 14 }} />
                              {contact.email || 'No email'}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <LocalPhoneOutlinedIcon style={{ fontSize: 14 }} />
                              {contact.phone || 'No phone'}
                            </Typography>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ bgcolor: '#ebeef0', borderRadius: 3, p: 3 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <DescriptionOutlinedIcon style={{ fontSize: 16 }} />
                        Documents
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>
                        {detailQuery.data.documents.length} files
                      </Typography>
                    </Stack>
                    <Stack spacing={1.25}>
                      {detailQuery.data.documents.length === 0 ? (
                        <Alert severity="info">No documents uploaded.</Alert>
                      ) : null}
                      {detailQuery.data.documents.map((document) => (
                        <Box
                          key={document.id}
                          sx={{
                            bgcolor: '#ffffff',
                            borderRadius: 2,
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            boxShadow: '0 1px 2px rgba(45, 51, 53, 0.06)',
                          }}
                        >
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: 1,
                              bgcolor:
                                document.docType.toLowerCase() === 'spreadsheet'
                                  ? '#d5e5eb'
                                  : '#a1e4fe',
                              color:
                                document.docType.toLowerCase() === 'spreadsheet'
                                  ? '#455459'
                                  : '#005468',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <FilePresentOutlinedIcon style={{ fontSize: 18 }} />
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 700 }} noWrap>
                              {document.title}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 10,
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                              }}
                            >
                              {document.docType} - {formatDate(document.uploadedAt)}
                            </Typography>
                          </Box>
                          <MuiExternalLink
                            href={document.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="none"
                            sx={{ color: 'text.secondary', display: 'inline-flex' }}
                          >
                            <DownloadOutlinedIcon style={{ fontSize: 18 }} />
                          </MuiExternalLink>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          ) : null}
        </Stack>
      </Box>
    </Container>
  );
}
