
async function testStaticVarFunc( someParameter )
{
    const initial_value = 1
    testStaticVarFunc.counter = testStaticVarFunc.counter || initial_value;

    return testStaticVarFunc.counter++
}


// Start function
const start = async function(a, b) {
    await testStaticVarFunc()
    await testStaticVarFunc()
    await testStaticVarFunc()
    await testStaticVarFunc()
    await testStaticVarFunc()
    
    console.log(await testStaticVarFunc())
}

// Call start
start();