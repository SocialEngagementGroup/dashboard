#!/bin/bash

echo "🧪 Testing API Endpoints..."
echo ""

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local METHOD=$1
    local ENDPOINT=$2
    local DESCRIPTION=$3
    local DATA=$4
    
    echo -e "${YELLOW}Testing:${NC} $DESCRIPTION"
    echo -e "${YELLOW}Endpoint:${NC} $METHOD $ENDPOINT"
    
    if [ -n "$DATA" ]; then
        RESPONSE=$(curl -s -X $METHOD "$BASE_URL$ENDPOINT" \
            -H "Content-Type: application/json" \
            -d "$DATA" \
            -w "\n%{http_code}")
    else
        RESPONSE=$(curl -s -X $METHOD "$BASE_URL$ENDPOINT" \
            -w "\n%{http_code}")
    fi
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 400 ]; then
        echo -e "${GREEN}✅ Status: $HTTP_CODE${NC}"
    else
        echo -e "${RED}❌ Status: $HTTP_CODE${NC}"
    fi
    
    echo -e "${YELLOW}Response:${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
    echo "---"
    echo ""
}

# Test 1: Check if server is running
echo "📊 Test 1: Server Health Check"
test_endpoint "GET" "/" "Homepage"

# Test 2: Tools API
echo "📊 Test 2: Tools API"
test_endpoint "GET" "/api/tools" "Get all tools"

# Test 3: User API
echo "📊 Test 3: User API"
test_endpoint "GET" "/api/user" "Get current user"

# Test 4: Admin - Departments
echo "📊 Test 4: Admin - Departments API"
test_endpoint "GET" "/api/admin/departments" "Get all departments"

# Test 5: Admin - Team Members
echo "📊 Test 5: Admin - Team Members API"
test_endpoint "GET" "/api/admin/team-members" "Get all team members"

echo ""
echo "✅ API Testing Complete!"
echo ""
echo "Note: Some endpoints may require authentication and return 401/403, which is expected."
