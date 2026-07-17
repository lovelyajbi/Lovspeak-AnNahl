import re

filepath = '/Users/nurliafebriani/Downloads/lovspeak6/src/constants/shadowingData.ts'

with open(filepath, 'r') as f:
    content = f.read()

# Add the new imports at the top
import_statement1 = "import { DAILY_ISLAMIC_ORIGINAL_THEMES } from './shadowing_daily_islamic_original_1';\n"
import_statement2 = "import { DAILY_ISLAMIC_ORIGINAL_THEMES_2 } from './shadowing_daily_islamic_original_2';\n"
if "DAILY_ISLAMIC_ORIGINAL_THEMES" not in content:
    content = import_statement1 + import_statement2 + content

# Find the start of the first old Islamic theme
start_str = "  {\n    id: 'isl_salah',"
end_str = "  {\n    id: 'gen_idioms_slang',"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    # Remove the old Islamic themes block
    content = content[:start_idx] + content[end_idx:]

# Add the new themes to the bottom spread list
# The list at the bottom looks like:
#   ...DAILY_ISLAMIC_THEMES,
#   ...IDIOMS_GENERAL_THEMES,

if "...DAILY_ISLAMIC_ORIGINAL_THEMES," not in content:
    # Insert right before DAILY_ISLAMIC_THEMES
    content = content.replace(
        "  ...DAILY_ISLAMIC_THEMES,",
        "  ...DAILY_ISLAMIC_ORIGINAL_THEMES,\n  ...DAILY_ISLAMIC_ORIGINAL_THEMES_2,\n  ...DAILY_ISLAMIC_THEMES,"
    )

with open(filepath, 'w') as f:
    f.write(content)

print("shadowingData.ts updated successfully!")
