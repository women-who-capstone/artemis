const router = require('express').Router();
const unirest = require('unirest');
var timeout = require('connect-timeout');
let descriptions = require('../../descriptions');
const Tag = require('../db/models/tag');
const ChannelTag = require('../db/models/channelTag');
const sw = require('stopword');
var WordPOS = require('wordpos');
let wordpos = new WordPOS({ stopwords: true });

var natural = require('natural');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

const string = `a
able
about
above
abst
accordance
according
accordingly
across
act
actually
added
adj
affected
affecting
affects
after
afterwards
again
against
ah
all
almost
alone
along
already
also
although
always
am
among
amongst
an
and
announce
another
any
anybody
anyhow
anymore
anyone
anything
anyway
anyways
anywhere
apparently
approximately
are
aren
arent
arise
around
as
aside
ask
asking
at
auth
available
away
awfully
b
back
be
became
because
become
becomes
becoming
been
before
beforehand
begin
beginning
beginnings
begins
behind
being
believe
below
beside
besides
between
beyond
biol
both
brief
briefly
but
by
c
ca
came
can
cannot
can't
cause
causes
certain
certainly
co
com
come
comes
contain
containing
contains
could
couldnt
d
date
did
didn't
different
do
does
doesn't
doing
done
don't
down
downwards
due
during
e
each
ed
edu
effect
eg
eight
eighty
either
else
elsewhere
end
ending
enough
especially
et
et-al
etc
even
ever
every
everybody
everyone
everything
everywhere
ex
except
f
far
few
ff
fifth
first
five
fix
followed
following
follows
for
former
formerly
forth
found
four
from
further
furthermore
g
gave
get
gets
getting
give
given
gives
giving
go
goes
gone
got
gotten
h
had
happens
hardly
has
hasn't
have
haven't
having
he
hed
hence
her
here
hereafter
hereby
herein
heres
hereupon
hers
herself
hes
hi
hid
him
himself
his
hither
home
how
howbeit
however
hundred
i
id
ie
if
i'll
im
immediate
immediately
importance
important
in
inc
indeed
index
information
instead
into
invention
inward
is
isn't
it
itd
it'll
its
itself
i've
just
keep
keeps
kept
kg
km
know
known
knows
largely
last
lately
later
latter
latterly
least
less
lest
let
lets
like
liked
likely
line
little
'll
look
looking
looks
ltd
m
made
mainly
make
makes
many
may
maybe
me
mean
means
meantime
meanwhile
merely
mg
might
million
miss
ml
more
moreover
most
mostly
mr
mrs
much
mug
must
my
myself
n
na
name
namely
nay
nd
near
nearly
necessarily
necessary
need
needs
neither
never
nevertheless
new
next
nine
ninety
no
nobody
non
none
nonetheless
noone
nor
normally
nos
not
noted
nothing
now
nowhere
o
obtain
obtained
obviously
of
off
often
oh
ok
okay
old
omitted
on
once
one
ones
only
onto
or
ord
other
others
otherwise
ought
our
ours
ourselves
out
outside
over
overall
owing
own
p
page
pages
part
particular
particularly
past
per
perhaps
placed
please
plus
poorly
possible
possibly
potentially
pp
predominantly
present
previously
primarily
probably
promptly
proud
provides
put
q
que
quickly
quite
qv
r
ran
rather
rd
re
readily
really
recent
recently
ref
refs
regarding
regardless
regards
related
relatively
research
respectively
resulted
resulting
results
right
run
s
said
same
saw
say
saying
says
sec
section
see
seeing
seem
seemed
seeming
seems
seen
self
selves
sent
seven
several
shall
she
shed
she'll
shes
should
shouldn't
show
showed
shown
showns
shows
significant
significantly
similar
similarly
since
six
slightly
so
some
somebody
somehow
someone
somethan
something
sometime
sometimes
somewhat
somewhere
soon
sorry
specifically
specified
specify
specifying
still
stop
strongly
sub
substantially
successfully
such
sufficiently
suggest
sup
sure	t
take
taken
taking
tell
tends
th
than
thank
thanks
thanx
that
that'll
thats
that've
the
their
theirs
them
themselves
then
thence
there
thereafter
thereby
thered
therefore
therein
there'll
thereof
therere
theres
thereto
thereupon
there've
these
they
theyd
they'll
theyre
they've
think
this
those
thou
though
thoughh
thousand
throug
through
throughout
thru
thus
til
tip
to
together
too
took
toward
towards
tried
tries
truly
try
trying
ts
twice
two
u
un
under
unfortunately
unless
unlike
unlikely
until
unto
up
upon
ups
us
use
used
useful
usefully
usefulness
uses
using
usually
v
value
various
've
very
via
viz
vol
vols
vs
w
want
wants
was
wasnt
way
we
wed
welcome
we'll
went
were
werent
we've
what
whatever
what'll
whats
when
whence
whenever
where
whereafter
whereas
whereby
wherein
wheres
whereupon
wherever
whether
which
while
whim
whither
who
whod
whoever
whole
who'll
whom
whomever
whos
whose
why
widely
willing
wish
with
within
without
wont
words
world
would
wouldnt
www
x
y
yes
yet
you
youd
you'll
your
youre
yours
yourself
yourselves
you've
z
zero
episode
no
http
www
site
us`;

const myStopwords = string.split('\n');

function exclude(text) {
	return text.filter((word) => !myStopwords.includes(word));
}

router.get('/', async (req, res, next) => {
	try {
		let channelId = req.query.channelId;
		let input = req.query.input.toLowerCase();
		let inputFiltered = await wordpos.getNouns(input, exclude);
		let descriptionsArr = descriptions.slice(0, 10);
		descriptionsArr.forEach((each) => {
			tfidf.addDocument(each);
		});
		let tagArray = inputFiltered.filter(async (each) => {
			let allDes = 0;
			let currentTag;

			tfidf.tfidfs(each, function(i, measure) {
				currentTag = each;
				allDes += measure;
			});
			let tagRating = allDes / descriptionsArr.length;
			return tagRating > 0.2 || tagRating === 0;
		});

		tagArray.forEach(async (currentTag) => {
			let tagId;
			let tag = await Tag.findOrCreate({
				where: {
					name: currentTag.toLowerCase()
				}
			});
			tagId = await tag[0].id;
			let previousTag = await ChannelTag.findById(tagId);
			if (!previousTag) {
				await ChannelTag.create({
					channelId: channelId,
					tagId: tagId,
					score: 0.5
				});
			}
		});

		res.json(inputFiltered);
	} catch (err) {
		next(err);
	}
});
module.exports = router;
