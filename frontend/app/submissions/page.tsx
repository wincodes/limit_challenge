'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Container,
  InputAdornment,
  Link as MuiLink,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import NoteIcon from '@mui/icons-material/Note';

import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { SubmissionStatus } from '@/lib/types';

const STATUS_OPTIONS: { label: string; value: SubmissionStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Closed', value: 'closed' },
  { label: 'Lost', value: 'lost' },
];

function formatStatusLabel(status: SubmissionStatus) {
  return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusChipStyles(status: SubmissionStatus) {
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

export default function SubmissionsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const initialFilters = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        status: '' as SubmissionStatus | '',
        brokerId: '',
        companyQuery: '',
        page: 1,
      };
    }

    const params = new URLSearchParams(window.location.search);
    const initialStatus = params.get('status');
    const initialPage = Number(params.get('page') ?? 1);

    return {
      status:
        initialStatus && STATUS_OPTIONS.some((option) => option.value === initialStatus)
          ? (initialStatus as SubmissionStatus)
          : '',
      brokerId: params.get('brokerId') ?? '',
      companyQuery: params.get('companySearch') ?? '',
      page: Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1,
    };
  }, []);

  const [status, setStatus] = useState<SubmissionStatus | ''>(
    initialFilters.status as SubmissionStatus | '',
  );
  const [brokerId, setBrokerId] = useState(initialFilters.brokerId);
  const [companyQuery, setCompanyQuery] = useState(initialFilters.companyQuery);
  const [page, setPage] = useState(initialFilters.page);

  const filters = useMemo(
    () => ({
      status: status || undefined,
      brokerId: brokerId || undefined,
      companySearch: companyQuery || undefined,
      page,
    }),
    [status, brokerId, companyQuery, page],
  );

  const submissionsQuery = useSubmissionsList(filters);
  const brokerQuery = useBrokerOptions();
  const totalPages = Math.max(1, Math.ceil((submissionsQuery.data?.count ?? 0) / 10));
  const submissionCount = submissionsQuery.data?.count ?? 0;

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) {
      params.set('status', status);
    }
    if (brokerId) {
      params.set('brokerId', brokerId);
    }
    if (companyQuery) {
      params.set('companySearch', companyQuery);
    }
    if (page > 1) {
      params.set('page', String(page));
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (typeof window !== 'undefined') {
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (currentUrl === nextUrl) {
        return;
      }
    }

    router.replace(nextUrl, { scroll: false });
  }, [brokerId, companyQuery, page, pathname, router, status]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Box sx={{ mb: 5 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 32, md: 42 },
              fontWeight: 800,
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            Submissions
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            Review and triage broker submissions with filters synced to URL query parameters.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 5 }}>
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 2,
              p: { xs: 2, md: 3 },
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'flex-end',
            }}
          >
            <Box sx={{ flex: '1 1 320px', minWidth: 240 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', mb: 1 }}>
                Company Search
              </Typography>
              <TextField
                value={companyQuery}
                onChange={(event) => {
                  setCompanyQuery(event.target.value);
                  setPage(1);
                }}
                fullWidth
                placeholder="Enter company name..."
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ width: { xs: '100%', md: 210 } }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', mb: 1 }}>
                Status
              </Typography>
              <TextField
                select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as SubmissionStatus | '');
                  setPage(1);
                }}
                fullWidth
                size="small"
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ width: { xs: '100%', md: 210 } }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', mb: 1 }}>
                Broker
              </Typography>
              <TextField
                select
                value={brokerId}
                onChange={(event) => {
                  setBrokerId(event.target.value);
                  setPage(1);
                }}
                fullWidth
                size="small"
              >
                <MenuItem value="">All Brokers</MenuItem>
                {brokerQuery.data?.map((broker) => (
                  <MenuItem key={broker.id} value={String(broker.id)}>
                    {broker.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Button
              variant="contained"
              sx={{
                bgcolor: '#526166',
                color: '#fff',
                px: 3,
                py: 1.2,
                '&:hover': { bgcolor: '#47555a' },
              }}
              onClick={() => setPage(1)}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: 'rgba(213, 219, 221, 0.2)',
            borderRadius: 2,
            px: 2,
            py: 1.5,
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Displaying {submissionsQuery.data?.results.length ?? 0} of {submissionCount} submissions
          </Typography>
        </Box>

        {submissionsQuery.isLoading && !submissionsQuery.data ? (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={20} />
            <Typography color="text.secondary">Loading submissions...</Typography>
          </Stack>
        ) : null}

        {submissionsQuery.isError ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Unable to load submissions. Try adjusting filters or refresh.
          </Alert>
        ) : null}

        {brokerQuery.isError ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Broker options are temporarily unavailable.
          </Alert>
        ) : null}

        {!submissionsQuery.isLoading &&
        !submissionsQuery.isError &&
        submissionsQuery.data &&
        submissionsQuery.data.results.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No submissions match your filters.
          </Alert>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
            gap: 3,
            pb: 6,
          }}
        >
          {submissionsQuery.data?.results.map((submission) => (
            <Card
              key={submission.id}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 3,
                p: 0.5,
                transition: 'transform 300ms ease',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 2,
                  p: 3,
                  boxShadow: '0 24px 40px rgba(45, 51, 53, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1}
                  mb={2}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {submission.company.legalName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      ID: {submission.id}
                    </Typography>
                  </Box>
                  <Stack spacing={0.75} alignItems="flex-end">
                    <Chip
                      label={formatStatusLabel(submission.status)}
                      size="small"
                      sx={{
                        ...getStatusChipStyles(submission.status),
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        px: 1,
                      }}
                    />
                    <Chip
                      label={`${submission.priority} Priority`}
                      size="small"
                      sx={{
                        ...getPriorityChipStyles(submission.priority),
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        px: 1,
                      }}
                    />
                  </Stack>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                  {submission.summary || 'No summary provided for this submission.'}
                </Typography>

                <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(173, 179, 181, 0.2)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: 'text.secondary',
                        }}
                      >
                        Broker
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#1b677d' }}>
                        {submission.broker.name}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <ArticleOutlinedIcon style={{ fontSize: 18 }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                          {String(submission.documentCount).padStart(2, '0')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <NoteIcon style={{ fontSize: 18 }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                          {submission.noteCount}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <MuiLink
                    component={Link}
                    href={`/submissions/${submission.id}`}
                    underline="none"
                    sx={{
                      mt: 4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      fontWeight: 700,
                      color: '#1b677d',
                      '&:hover .arrow-icon': { transform: 'translateX(4px)' },
                    }}
                  >
                    View details
                    <ArrowForwardIcon style={{ transition: 'transform 200ms ease' }} />
                  </MuiLink>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {submissionCount > 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, nextPage) => setPage(nextPage)}
              shape="rounded"
              color="primary"
              size="large"
            />
          </Box>
        ) : null}
      </Box>
    </Container>
  );
}
