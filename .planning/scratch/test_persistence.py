import asyncio
import json
import os
import shutil
from seg_core import SEGPersonaGenerator
from ai_service import AIService

async def test_persistence():
    # Setup clean data dir
    test_data_dir = "test_data"
    if os.path.exists(test_data_dir):
        shutil.rmtree(test_data_dir)
    os.makedirs(test_data_dir)
    
    # Mock AIService to avoid API calls
    class MockAIService:
        async def generate_response(self, **kwargs):
            return type('obj', (object,), {'content': 'Mock response', 'error': None})
            
    generator = SEGPersonaGenerator(ai_service=MockAIService(), data_dir=test_data_dir)
    
    # 1. Test Custom Replicant Persistence
    print("Creating custom replicant...")
    await generator.create_custom_replicant(
        archetype_name="TestReplicant",
        core_function="Testing persistence",
        directive="Be a test subject"
    )
    
    # 2. Test Generated Persona Persistence
    print("Generating persona...")
    await generator.generate_persona(
        name="TestUser",
        profession="Tester",
        defining_experience="The first test"
    )
    
    # Verify files exist
    custom_rep_file = os.path.join(test_data_dir, "custom_replicants.json")
    gen_pers_file = os.path.join(test_data_dir, "generated_personas.json")
    
    print(f"Checking for {custom_rep_file}: {os.path.exists(custom_rep_file)}")
    print(f"Checking for {gen_pers_file}: {os.path.exists(gen_pers_file)}")
    
    # 3. Test Reload
    print("Reloading generator...")
    generator2 = SEGPersonaGenerator(ai_service=MockAIService(), data_dir=test_data_dir)
    
    print(f"Loaded custom replicants: {list(generator2.registry.custom_replicants.keys())}")
    print(f"Loaded generated personas: {list(generator2.generated_personas.keys())}")
    
    success = ("TestReplicant" in generator2.registry.custom_replicants and 
               "TestUser" in generator2.generated_personas)
    
    if success:
        print("✅ Persistence test PASSED")
    else:
        print("❌ Persistence test FAILED")
        
    # Cleanup
    shutil.rmtree(test_data_dir)

if __name__ == "__main__":
    asyncio.run(test_persistence())
