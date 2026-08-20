#!/usr/bin/env bash
# One-time Firebase Hosting bootstrap for kyber-site.
# Run anywhere `gcloud` is logged in as the project owner and `gh` is logged in
# (e.g. the razer dev-box: export PATH="$HOME/google-cloud-sdk/bin:$PATH").
#
# Creates:
#   1. Firebase Hosting site `kyber-voget-io` in project kinetic-object-322814
#   2. Deployer service account + key, stored as the FIREBASE_SERVICE_ACCOUNT
#      repo secret on matty-v/kyber-site
#   3. The custom-domain request for kyber.voget.io (prints the DNS records to
#      add in Cloudflare; falls back to console instructions if the API balks)
set -euo pipefail

PROJECT=kinetic-object-322814
SITE=kyber-voget-io
DOMAIN=kyber.voget.io
REPO=matty-v/kyber-site
SA_NAME=github-action-kyber-site
SA_EMAIL="${SA_NAME}@${PROJECT}.iam.gserviceaccount.com"

TOKEN=$(gcloud auth print-access-token)
api() {
  curl -sS -X "$1" "https://firebasehosting.googleapis.com/v1beta1/$2" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Goog-User-Project: $PROJECT" \
    -H "Content-Type: application/json" \
    "${@:3}"
}

echo "==> 1/3 Creating Hosting site $SITE"
create_out=$(api POST "projects/$PROJECT/sites?siteId=$SITE" -d '{}')
if echo "$create_out" | grep -q '"error"'; then
  if echo "$create_out" | grep -q 'ALREADY_EXISTS'; then
    echo "    already exists, fine"
  else
    echo "$create_out"; exit 1
  fi
else
  echo "    created"
fi

echo "==> 2/3 Deployer service account + repo secret"
if ! gcloud iam service-accounts describe "$SA_EMAIL" --project "$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$SA_NAME" --project "$PROJECT" \
    --display-name "GitHub Actions deploy for kyber-site"
fi
gcloud projects add-iam-policy-binding "$PROJECT" \
  --member "serviceAccount:$SA_EMAIL" \
  --role roles/firebasehosting.admin --condition=None >/dev/null
KEYFILE=$(mktemp)
gcloud iam service-accounts keys create "$KEYFILE" \
  --iam-account "$SA_EMAIL" --project "$PROJECT"
gh secret set FIREBASE_SERVICE_ACCOUNT -R "$REPO" < "$KEYFILE"
rm -f "$KEYFILE"
echo "    secret FIREBASE_SERVICE_ACCOUNT set on $REPO"

echo "==> 3/3 Custom domain $DOMAIN"
domain_out=$(api POST "projects/$PROJECT/sites/$SITE/customDomains?customDomainId=$DOMAIN" \
  -d '{}' || true)
if echo "$domain_out" | grep -q '"error"'; then
  if echo "$domain_out" | grep -q 'ALREADY_EXISTS'; then
    echo "    domain request already exists"
  else
    echo "    API route did not work; use the console instead:"
    echo "    Firebase console -> Hosting -> $SITE -> Add custom domain -> $DOMAIN"
    echo "    then add the records it shows in Cloudflare (DNS-only / gray cloud)."
  fi
fi
echo "    Current domain status (look for requiredDnsUpdates -> add those in Cloudflare, DNS-only):"
api GET "projects/$PROJECT/sites/$SITE/customDomains/$DOMAIN" || true

echo
echo "Done. Re-run the deploy workflow (or push to main) and the site will be"
echo "live at https://$SITE.web.app, then at https://$DOMAIN once DNS is in."
