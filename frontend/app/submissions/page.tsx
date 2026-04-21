'use client';

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Container,
  Divider,
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

  const [status, setStatus] = useState<SubmissionStatus | ''>(initialFilters.status as SubmissionStatus | '');
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1">
            Submissions
          </Typography>
          <Typography color="text.secondary">
            Review and triage broker submissions with filters synced to URL query parameters.
          </Typography>
        </Box>

        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Status"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as SubmissionStatus | '');
                  setPage(1);
                }}
                fullWidth
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Broker"
                value={brokerId}
                onChange={(event) => {
                  setBrokerId(event.target.value);
                  setPage(1);
                }}
                fullWidth
                helperText={
                  brokerQuery.isError ? 'Could not load broker options' : 'Filter by broker'
                }
              >
                <MenuItem value="">All brokers</MenuItem>
                {brokerQuery.data?.map((broker) => (
                  <MenuItem key={broker.id} value={String(broker.id)}>
                    {broker.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Company search"
                value={companyQuery}
                onChange={(event) => {
                  setCompanyQuery(event.target.value);
                  setPage(1);
                }}
                fullWidth
                helperText="Matches company legal name"
              />
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Submission list</Typography>
              <Divider />
              {submissionsQuery.isLoading && !submissionsQuery.data ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">Loading submissions...</Typography>
                </Stack>
              ) : null}

              {submissionsQuery.isError ? (
                <Alert severity="error">
                  Unable to load submissions. Try adjusting filters or refresh.
                </Alert>
              ) : null}

              {!submissionsQuery.isLoading &&
              !submissionsQuery.isError &&
              submissionsQuery.data &&
              submissionsQuery.data.results.length === 0 ? (
                <Alert severity="info">No submissions match your filters.</Alert>
              ) : null}

              {submissionsQuery.data?.results.map((submission) => (
                <Card key={submission.id} variant="outlined">
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={1}
                      >
                        <Typography variant="h6">{submission.company.legalName}</Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip size="small" label={submission.status.replace('_', ' ')} />
                          <Chip
                            size="small"
                            color="primary"
                            label={`Priority: ${submission.priority}`}
                          />
                        </Stack>
                      </Stack>
                      <Typography color="text.secondary">
                        {submission.summary || 'No summary provided'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Broker: {submission.broker.name} | Owner: {submission.owner.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Documents: {submission.documentCount} | Notes: {submission.noteCount}
                      </Typography>
                      <MuiLink
                        component={Link}
                        href={`/submissions/${submission.id}`}
                        underline="hover"
                      >
                        View details
                      </MuiLink>
                    </Stack>
                  </CardContent>
                </Card>
              ))}

              {submissionsQuery.data && submissionsQuery.data.count > 0 ? (
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    {submissionsQuery.data.count} total submissions
                  </Typography>
                  <Pagination
                    page={page}
                    count={totalPages}
                    onChange={(_, nextPage) => setPage(nextPage)}
                    shape="rounded"
                    color="primary"
                  />
                </Box>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
