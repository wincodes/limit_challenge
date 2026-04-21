'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

export default function HomePage() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 }, py: { xs: 8, md: 14 } }}>
        <Box
          sx={{
            maxWidth: 1280,
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' },
            gap: { xs: 6, lg: 8 },
            alignItems: 'center',
          }}
        >
          <Box sx={{ gridColumn: { lg: 'span 7' }, position: 'relative', zIndex: 1 }}>
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                bgcolor: '#a1e4fe',
                color: '#005468',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: 20,
                mb: 3,
                mx: 1,
              }}
            >
              Development Scaffold
            </Box>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 44, md: 72 },
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                mb: 3,
              }}
            >
              Submission Tracker <br />
              <Box component="span" sx={{ color: '#1b677d', fontStyle: 'italic' }}>
                Challenge
              </Box>
            </Typography>

            <Typography
              sx={{ fontSize: { xs: 18, md: 22 }, color: 'text.secondary', maxWidth: 720, mb: 5 }}
            >
              Use this scaffold to build the submissions list and detail experiences. Head to the
              workspace to start wiring up API calls, filters, and UI polish.
            </Typography>

            <Button
              variant="contained"
              onClick={() => router.push('/submissions')}
              sx={{
                px: 4,
                py: 1.75,
                borderRadius: 2.5,
                fontWeight: 800,
                letterSpacing: '0.02em',
                background: 'linear-gradient(135deg, #1b677d 0%, #025b71 100%)',
                boxShadow: '0 10px 24px rgba(27, 103, 125, 0.32)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  background: 'linear-gradient(135deg, #1b677d 0%, #025b71 100%)',
                },
              }}
            >
              Go To Submissions
              <ArrowForwardIcon style={{ marginLeft: 8, fontSize: 20 }} />
            </Button>
          </Box>

          <Box sx={{ gridColumn: { lg: 'span 5' }, position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '50%',
                bgcolor: '#e5e9eb',
                opacity: 0.5,
                filter: 'blur(42px)',
              }}
            />

            <Box
              sx={{
                position: 'relative',
                p: 2,
                borderRadius: 3,
                bgcolor: '#ffffff',
                boxShadow: '0 24px 36px rgba(45, 51, 53, 0.12)',
                border: '1px solid rgba(173, 179, 181, 0.2)',
                transform: 'rotate(3deg)',
                zIndex: 2,
              }}
            >
              <Box
                component="img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx26iKDI9iH4LvI15LboiFrzN28MP_lRKNjFbu46TO-laEwlTXDHiyouWsCVSZKfI3W8sNet8gLILHIsn8f3HRSHRHK7ngOqqP3aGgLtTZmMvwtHy-7kelpu0kXjsH8HD_w2mlBPE8q5Fru-FpWqSCPnnz2aodGT2NAvYz34Sp5fmbMX5gg7WthSYLuI2O03OZ3pzcAy-RIfE9rsAqPRQ0L6lyOoGuZJilM8kx2WwLdVOA7dBOh6LKyNha-86zQ4VmU0YvhYih-rk"
                alt="Dashboard Preview"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  filter: 'grayscale(1) contrast(1.15)',
                  opacity: 0.82,
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  left: -24,
                  bottom: -24,
                  bgcolor: '#1b677d',
                  color: '#f1faff',
                  borderRadius: 2,
                  px: 2.5,
                  py: 2,
                  boxShadow: '0 18px 30px rgba(27, 103, 125, 0.35)',
                  transform: 'rotate(-6deg)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      bgcolor: '#a1e4fe',
                      color: '#005468',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <InsightsOutlinedIcon style={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, lineHeight: 1 }}>25</Typography>
                    <Typography
                      sx={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                    >
                      Submissions
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
