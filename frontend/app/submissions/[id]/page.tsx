'use client';

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Link as MuiLink,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useSubmissionDetail } from '@/lib/hooks/useSubmissions';

export default function SubmissionDetailPage() {
  const params = useParams<{ id: string }>();
  const submissionId = params?.id ?? '';

  const detailQuery = useSubmissionDetail(submissionId);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div>
            <Typography variant="h4">Submission detail</Typography>
            <Typography color="text.secondary">
              Use this page to present the full submission payload along with contacts, documents,
              and notes.
            </Typography>
          </div>
          <MuiLink component={Link} href="/submissions" underline="none">
            Back to list
          </MuiLink>
        </Box>

        <Card variant="outlined">
          <CardContent>
            {detailQuery.isLoading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={20} />
                <Typography color="text.secondary">Loading submission details...</Typography>
              </Stack>
            ) : null}

            {detailQuery.isError ? (
              <Alert severity="error">Unable to load this submission right now.</Alert>
            ) : null}

            {detailQuery.data ? (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6">{detailQuery.data.company.legalName}</Typography>
                  <Typography color="text.secondary">
                    Status: {detailQuery.data.status.replace('_', ' ')} | Priority:{' '}
                    {detailQuery.data.priority}
                  </Typography>
                  <Typography color="text.secondary">
                    Broker: {detailQuery.data.broker.name} | Owner:{' '}
                    {detailQuery.data.owner.fullName}
                  </Typography>
                </Box>

                <Typography>{detailQuery.data.summary || 'No summary provided.'}</Typography>
                <Divider />

                <Box>
                  <Typography variant="subtitle1">
                    Contacts ({detailQuery.data.contacts.length})
                  </Typography>
                  <List dense disablePadding>
                    {detailQuery.data.contacts.map((contact) => (
                      <ListItem key={contact.id} disableGutters>
                        <ListItemText
                          primary={`${contact.name}${contact.role ? ` - ${contact.role}` : ''}`}
                          secondary={`${contact.email || 'No email'} | ${contact.phone || 'No phone'}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Typography variant="subtitle1">
                    Documents ({detailQuery.data.documents.length})
                  </Typography>
                  <List dense disablePadding>
                    {detailQuery.data.documents.map((document) => (
                      <ListItem key={document.id} disableGutters>
                        <ListItemText
                          primary={document.title}
                          secondary={`${document.docType} | Uploaded ${new Date(document.uploadedAt).toLocaleDateString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Typography variant="subtitle1">
                    Notes ({detailQuery.data.notes.length})
                  </Typography>
                  <List dense disablePadding>
                    {detailQuery.data.notes.map((note) => (
                      <ListItem key={note.id} disableGutters>
                        <ListItemText
                          primary={`${note.authorName} - ${new Date(note.createdAt).toLocaleString()}`}
                          secondary={note.body}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Stack>
            ) : null}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
