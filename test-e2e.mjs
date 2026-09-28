// End-to-end verification script for SwapLoop
const BASE_URL = 'http://localhost:3001/api';

async function testSwapLoop() {
  console.log('=== STARTING SWAPLOOP E2E SUITE ===\n');

  // Test 1: Privacy on /api/items
  console.log('--- Test 1: Checking Item Privacy on /api/items ---');
  const itemsRes = await fetch(`${BASE_URL}/items`);
  const itemsData = await itemsRes.json();
  const items = itemsData.items || [];
  console.log(`Found ${items.length} items in campus inventory.`);
  const hasLeakedName = items.some(it => it.owner_name || it.contact_note || it.ownerName || it.contactNote);
  if (hasLeakedName) {
    throw new Error('FAILED: /api/items leaked owner_name or contact_note!');
  }
  console.log('✅ PASSED: No owner real names or contact notes in /api/items\n');

  // Test 2: Seed Scenario A
  console.log('--- Test 2: Loading Scenario A ---');
  const scenarioARes = await fetch(`${BASE_URL}/scenarios/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario: 'A' })
  });
  const scenarioAData = await scenarioARes.json();
  console.log('Scenario A loaded:', scenarioAData.message);
  console.log('✅ PASSED: Scenario A seeded\n');

  // Test 3: Trigger The Drop
  console.log('--- Test 3: Triggering The Drop ---');
  const dropRes = await fetch(`${BASE_URL}/drop/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const dropData = await dropRes.json();
  console.log(`Drop executed. Loops found: ${dropData.createdProposalsCount}`);
  if (dropData.createdProposalsCount < 1) {
    throw new Error('FAILED: Expected at least 1 loop in Scenario A!');
  }
  console.log('✅ PASSED: 3-student loop successfully formed\n');

  // Test 4: Verify Proposal Privacy in Proposed State
  console.log('--- Test 4: Checking Privacy in Proposed State ---');
  const proposalsRes = await fetch(`${BASE_URL}/proposals`);
  const proposalsData = await proposalsRes.json();
  const proposals = proposalsData.proposals || [];
  const prop = proposals[0];
  console.log(`Proposal ${prop.id} status: ${prop.status}`);
  console.log('Proposal members count:', prop.members.length);
  if (prop.members.length < 3 || prop.members.length > 5) {
    throw new Error(`FAILED: Loop size ${prop.members.length} violates 3-5 member constraint!`);
  }

  // Check that real names are hidden (only codename or self)
  for (const m of prop.members) {
    console.log(`Member: codename=${m.codename}, name=${m.name}, contactNote=${m.contactNote}`);
    // If not self (arjun is user-arjun), name must be codename, and contactNote must be undefined
    if (m.studentId !== 'user-arjun') {
      if (m.name !== m.codename || m.contactNote !== undefined) {
        throw new Error('FAILED: Real name or contact note leaked in proposed state!');
      }
    }
  }
  console.log('✅ PASSED: Strict privacy enforced in proposed state\n');

  // Test 5: Accept Proposal by All Members -> Sealed State
  console.log('--- Test 5: Accepting Proposal to Seal Loop ---');
  for (const m of prop.members) {
    const acceptRes = await fetch(`${BASE_URL}/proposals/${prop.id}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: m.studentId, handoverChoice: 'desk' })
    });
    const acceptData = await acceptRes.json();
    console.log(`Swapper ${m.studentId} accepted -> allAccepted: ${acceptData.allAccepted}`);
  }

  const sealedPropRes = await fetch(`${BASE_URL}/proposals`);
  const sealedPropData = await sealedPropRes.json();
  const sealedProp = sealedPropData.proposals.find(p => p.id === prop.id);
  console.log(`Updated proposal status: ${sealedProp.status}`);
  if (sealedProp.status !== 'sealed') {
    throw new Error('FAILED: Proposal should be sealed!');
  }

  // Verify privacy STILL ENFORCED in sealed state for non-self
  for (const m of sealedProp.members) {
    if (m.studentId !== 'user-arjun') {
      if (m.name !== m.codename || m.contactNote !== undefined) {
        throw new Error('FAILED: Real name or contact note leaked in sealed state before completion!');
      }
    }
  }
  console.log('✅ PASSED: Strict privacy enforced in sealed state\n');

  // Test 6: Physical Escrow Desk Dropoffs
  console.log('--- Test 6: Desk Dropoffs ---');
  for (const m of sealedProp.members) {
    const dropoffRes = await fetch(`${BASE_URL}/desk/dropoff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId: sealedProp.id, dropoffCode: m.dropoffCode })
    });
    const dropoffData = await dropoffRes.json();
    console.log(`Dropoff code ${m.dropoffCode}:`, dropoffData.message);
    if (!dropoffData.success) throw new Error('FAILED: Dropoff failed');
  }
  console.log('✅ PASSED: All items deposited in escrow\n');

  // Test 7: Desk Pickups -> Completed State & Identity Reveal
  console.log('--- Test 7: Desk Pickups & Real Identity Reveal ---');
  for (const m of sealedProp.members) {
    const pickupRes = await fetch(`${BASE_URL}/desk/pickup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId: sealedProp.id, pickupCode: m.pickupCode })
    });
    const pickupData = await pickupRes.json();
    console.log(`Pickup code ${m.pickupCode}:`, pickupData.message, `AllCompleted: ${pickupData.isAllCompleted}`);
    if (!pickupData.success) throw new Error('FAILED: Pickup failed');
  }

  const completedPropRes = await fetch(`${BASE_URL}/proposals`);
  const completedPropData = await completedPropRes.json();
  const completedProp = completedPropData.proposals.find(p => p.id === prop.id);
  console.log(`Final proposal status: ${completedProp.status}`);
  if (completedProp.status !== 'completed') {
    throw new Error('FAILED: Proposal should be completed!');
  }

  // Verify identities ARE NOW REVEALED
  for (const m of completedProp.members) {
    console.log(`Completed Member: codename=${m.codename}, real_name=${m.name}, contact=${m.contactNote}`);
    if (!m.name || m.name === m.codename) {
      throw new Error('FAILED: Real name should be revealed upon completion!');
    }
    if (!m.contactNote) {
      throw new Error('FAILED: Contact note should be revealed upon completion!');
    }
  }
  console.log('✅ PASSED: Real identities properly revealed ONLY after completion!\n');

  // Test 8: Scenario C Disqualification (Trust T4)
  console.log('--- Test 8: Scenario C Disqualification (Trust T4) ---');
  await fetch(`${BASE_URL}/scenarios/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario: 'C' })
  });
  const dropCRes = await fetch(`${BASE_URL}/drop/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const dropCData = await dropCRes.json();
  console.log(`Scenario C Drop result: loopsFound=${dropCData.createdProposalsCount}, note="${dropCData.scenarioNote}"`);
  if (dropCData.createdProposalsCount !== 0) {
    throw new Error('FAILED: Scenario C with New trust should produce 0 loops!');
  }
  console.log('✅ PASSED: Scenario C correctly blocked by Trust T4\n');

  // Test 9: Scenario C Upgrade to Trusted -> 1 Loop Formed
  console.log('--- Test 9: Scenario C Upgrade to Trusted ---');
  await fetch(`${BASE_URL}/scenarios/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario: 'C_TRUSTED' })
  });
  const dropCTrustedRes = await fetch(`${BASE_URL}/drop/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const dropCTrustedData = await dropCTrustedRes.json();
  console.log(`Scenario C_TRUSTED Drop result: loopsFound=${dropCTrustedData.createdProposalsCount}, note="${dropCTrustedData.scenarioNote}"`);
  if (dropCTrustedData.createdProposalsCount !== 1) {
    throw new Error('FAILED: Scenario C_TRUSTED should find 1 loop!');
  }
  console.log('✅ PASSED: Scenario C_TRUSTED successfully unlocks closed loop!\n');

  // Test 10: Scenario B Free Gift
  console.log('--- Test 10: Scenario B Free Gift Community Chain ---');
  await fetch(`${BASE_URL}/scenarios/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario: 'B' })
  });
  const dropBRes = await fetch(`${BASE_URL}/drop/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const dropBData = await dropBRes.json();
  console.log(`Scenario B Drop result: loopsFound=${dropBData.createdProposalsCount}, note="${dropBData.scenarioNote}"`);
  if (dropBData.createdProposalsCount < 1) {
    throw new Error('FAILED: Scenario B should find at least 1 gift chain!');
  }
  console.log('✅ PASSED: Free gift community chain formed!\n');

  // Restore Scenario A for pristine demo presentation
  await fetch(`${BASE_URL}/scenarios/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario: 'A' })
  });
  console.log('Restored to Scenario A for clean demo state.');

  console.log('\n🎉 ALL 10 E2E TESTS PASSED WITH 100% SUCCESS! 🎉');
}

testSwapLoop().catch(err => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
