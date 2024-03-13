import discord
import asyncio

# Burayı Değiştir YOUR_BOT_TOKEN Discord bot tokenin ile
client = discord.Client()

@client.event
async def on_ready():
    print('The bot is ready!')

@client.command()
async def ticket(ctx):
    # Create a new ticket category
    category = await ctx.guild.create_text_channel('ticket-' + ctx.author.name)

    # Create a new ticket channel
    ticket = await category.create_text_channel(ctx.author.name)

    # Send a welcome message to the ticket channel
    await ticket.send(f'Hello {ctx.author.mention}! Welcome to your support ticket. Please describe your issue or question below. A moderator or administrator will be with you shortly.')

    # Add the ticket channel to a private category
    overwrites = {
        ctx.guild.default_role: discord.PermissionOverwrite(read_messages=False),
        ctx.author: discord.PermissionOverwrite(read_messages=True),
        ctx.guild.roles.find(lambda r: r.name == 'Moderators'): discord.PermissionOverwrite(read_messages=True)
    }
    await ticket.edit(position=0, category=category, overwrites=overwrites)

    # Notify the moderators and administrators
    moderators = ctx.guild.roles.find(lambda r: r.name == 'Moderators')
    administrators = ctx.guild.roles.find(lambda r: r.name == 'Administrators')
    if moderators:
        await moderators.first().message('A new support ticket has been opened by {0.author.mention} in {1.mention}.'.format(ctx, ticket))
    if administrators:
        await administrators.first().message('A new support ticket has been opened by {0.author.mention} in {1.mention}.'.format(ctx, ticket))

client.run('YOUR_BOT_TOKEN')
